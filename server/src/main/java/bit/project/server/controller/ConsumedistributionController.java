package bit.project.server.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import org.springframework.data.domain.PageRequest;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.entity.Consumedistribution;
import bit.project.server.dao.ConsumedistributionDao;
import bit.project.server.entity.Consumedistributionitem;
import bit.project.server.util.validation.EntityValidator;
import bit.project.server.util.exception.ConflictException;
import bit.project.server.entity.Consumedistributionstatus;
import bit.project.server.util.validation.ValidationErrorBag;
import bit.project.server.util.security.AccessControlManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import bit.project.server.util.exception.DataValidationException;
import bit.project.server.util.exception.ObjectNotFoundException;

@CrossOrigin
@RestController
@RequestMapping("/consumedistributions")
public class ConsumedistributionController{

    @Autowired
    private ConsumedistributionDao consumedistributionDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ConsumedistributionController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("consumedistribution");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("CID");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Consumedistribution> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all consumedistributions", UsecaseList.SHOW_ALL_CONSUMEDISTRIBUTIONS);

        if(pageQuery.isEmptySearch()){
            return consumedistributionDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer branchId = pageQuery.getSearchParamAsInteger("branch");
        Integer consumedistributionstatusId = pageQuery.getSearchParamAsInteger("consumedistributionstatus");

        LocalDate startDate = LocalDate.parse(pageQuery.getSearchParam("startDate"));
        LocalDate endtDate = LocalDate.parse(pageQuery.getSearchParam("endtDate"));

        List<Consumedistribution> consumedistributions = consumedistributionDao.findAll(DEFAULT_SORT);
        Stream<Consumedistribution> stream = consumedistributions.parallelStream();

        List<Consumedistribution> filteredConsumedistributions = stream.filter(consumedistribution -> {

            if (!(startDate.isEqual(LocalDate.parse("1970-01-01")) && endtDate.isEqual(LocalDate.parse("1970-01-01"))))
                if(!((consumedistribution.getDate().isAfter(startDate) && consumedistribution.getDate().isBefore(endtDate))
                        || consumedistribution.getDate().isEqual(startDate) || consumedistribution.getDate().isEqual(endtDate)))
                    return false;

            if(code!=null)
                if(!consumedistribution.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(branchId!=null)
                if(!consumedistribution.getBranch().getId().equals(branchId)) return false;
            if(consumedistributionstatusId!=null)
                if(!consumedistribution.getConsumedistributionstatus().getId().equals(consumedistributionstatusId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredConsumedistributions, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Consumedistribution> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all consumedistributions' basic data", UsecaseList.SHOW_ALL_CONSUMEDISTRIBUTIONS);
        return consumedistributionDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Consumedistribution get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get consumedistribution", UsecaseList.SHOW_CONSUMEDISTRIBUTION_DETAILS);
        Optional<Consumedistribution> optionalConsumedistribution = consumedistributionDao.findById(id);
        if(optionalConsumedistribution.isEmpty()) throw new ObjectNotFoundException("Consumedistribution not found");
        return optionalConsumedistribution.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete consumedistributions", UsecaseList.DELETE_CONSUMEDISTRIBUTION);

        try{
            if(consumedistributionDao.existsById(id)) consumedistributionDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this consumedistribution already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Consumedistribution consumedistribution, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new consumedistribution", UsecaseList.ADD_CONSUMEDISTRIBUTION);

        consumedistribution.setTocreation(LocalDateTime.now());
        consumedistribution.setCreator(authUser);
        consumedistribution.setId(null);
        consumedistribution.setConsumedistributionstatus(new Consumedistributionstatus(1));;

        for(Consumedistributionitem consumedistributionitem : consumedistribution.getConsumedistributionitemList()) consumedistributionitem.setConsumedistribution(consumedistribution);

        EntityValidator.validate(consumedistribution);

        PersistHelper.save(()->{
            consumedistribution.setCode(codeGenerator.getNextId(codeConfig));
            return consumedistributionDao.save(consumedistribution);
        });

        return new ResourceLink(consumedistribution.getId(), "/consumedistributions/"+consumedistribution.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Consumedistribution consumedistribution, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update consumedistribution details", UsecaseList.UPDATE_CONSUMEDISTRIBUTION);

        Optional<Consumedistribution> optionalConsumedistribution = consumedistributionDao.findById(id);
        if(optionalConsumedistribution.isEmpty()) throw new ObjectNotFoundException("Consumedistribution not found");
        Consumedistribution oldConsumedistribution = optionalConsumedistribution.get();

        consumedistribution.setId(id);
        consumedistribution.setCode(oldConsumedistribution.getCode());
        consumedistribution.setCreator(oldConsumedistribution.getCreator());
        consumedistribution.setTocreation(oldConsumedistribution.getTocreation());

        for(Consumedistributionitem consumedistributionitem : consumedistribution.getConsumedistributionitemList()) consumedistributionitem.setConsumedistribution(consumedistribution);

        EntityValidator.validate(consumedistribution);

        consumedistribution = consumedistributionDao.save(consumedistribution);
        return new ResourceLink(consumedistribution.getId(), "/consumedistributions/"+consumedistribution.getId());
    }

}
