package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.*;
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
import bit.project.server.dao.ConsumeitempurchaseDao;
import bit.project.server.util.validation.EntityValidator;
import bit.project.server.util.exception.ConflictException;
import bit.project.server.util.validation.ValidationErrorBag;
import bit.project.server.util.security.AccessControlManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import bit.project.server.util.exception.DataValidationException;
import bit.project.server.util.exception.ObjectNotFoundException;

@CrossOrigin
@RestController
@RequestMapping("/consumeitempurchases")
public class ConsumeitempurchaseController{

    @Autowired
    private ConsumeitempurchaseDao consumeitempurchaseDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ConsumeitempurchaseController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("consumeitempurchase");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("CIP");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Consumeitempurchase> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all consumeitempurchases", UsecaseList.SHOW_ALL_CONSUMEITEMPURCHASES);

        if(pageQuery.isEmptySearch()){
            return consumeitempurchaseDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer vendorId = pageQuery.getSearchParamAsInteger("vendor");

        List<Consumeitempurchase> consumeitempurchases = consumeitempurchaseDao.findAll(DEFAULT_SORT);
        Stream<Consumeitempurchase> stream = consumeitempurchases.parallelStream();

        List<Consumeitempurchase> filteredConsumeitempurchases = stream.filter(consumeitempurchase -> {
            if(code!=null)
                if(!consumeitempurchase.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(vendorId!=null)
                if(!consumeitempurchase.getVendor().getId().equals(vendorId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredConsumeitempurchases, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Consumeitempurchase> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all consumeitempurchases' basic data", UsecaseList.SHOW_ALL_CONSUMEITEMPURCHASES, UsecaseList.ADD_CONSUMEITEMPAYMENT, UsecaseList.UPDATE_CONSUMEITEMPAYMENT);
        return consumeitempurchaseDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Consumeitempurchase get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get consumeitempurchase", UsecaseList.SHOW_CONSUMEITEMPURCHASE_DETAILS);
        Optional<Consumeitempurchase> optionalConsumeitempurchase = consumeitempurchaseDao.findById(id);
        if(optionalConsumeitempurchase.isEmpty()) throw new ObjectNotFoundException("Consumeitempurchase not found");
        return optionalConsumeitempurchase.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete consumeitempurchases", UsecaseList.DELETE_CONSUMEITEMPURCHASE);

        try{
            if(consumeitempurchaseDao.existsById(id)) consumeitempurchaseDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this consumeitempurchase already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Consumeitempurchase consumeitempurchase, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new consumeitempurchase", UsecaseList.ADD_CONSUMEITEMPURCHASE);

        consumeitempurchase.setTocreation(LocalDateTime.now());
        consumeitempurchase.setCreator(authUser);
        consumeitempurchase.setId(null);

        for(Consumeitempurchaseconsumeitem consumeitempurchaseconsumeitem : consumeitempurchase.getConsumeitempurchaseconsumeitemList()) consumeitempurchaseconsumeitem.setConsumeitempurchase(consumeitempurchase);

        EntityValidator.validate(consumeitempurchase);

        PersistHelper.save(()->{
            consumeitempurchase.setCode(codeGenerator.getNextId(codeConfig));
            return consumeitempurchaseDao.save(consumeitempurchase);
        });

        return new ResourceLink(consumeitempurchase.getId(), "/consumeitempurchases/"+consumeitempurchase.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Consumeitempurchase consumeitempurchase, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update consumeitempurchase details", UsecaseList.UPDATE_CONSUMEITEMPURCHASE);

        Optional<Consumeitempurchase> optionalConsumeitempurchase = consumeitempurchaseDao.findById(id);
        if(optionalConsumeitempurchase.isEmpty()) throw new ObjectNotFoundException("Consumeitempurchase not found");
        Consumeitempurchase oldConsumeitempurchase = optionalConsumeitempurchase.get();

        consumeitempurchase.setId(id);
        consumeitempurchase.setCode(oldConsumeitempurchase.getCode());
        consumeitempurchase.setCreator(oldConsumeitempurchase.getCreator());
        consumeitempurchase.setTocreation(oldConsumeitempurchase.getTocreation());

        for(Consumeitempurchaseconsumeitem consumeitempurchaseconsumeitem : consumeitempurchase.getConsumeitempurchaseconsumeitemList()) consumeitempurchaseconsumeitem.setConsumeitempurchase(consumeitempurchase);

        EntityValidator.validate(consumeitempurchase);

        consumeitempurchase = consumeitempurchaseDao.save(consumeitempurchase);
        return new ResourceLink(consumeitempurchase.getId(), "/consumeitempurchases/"+consumeitempurchase.getId());
    }


    @GetMapping("/nonepayed")
    public List<Consumeitempurchase> getAllNonePayed(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all procurementitemtypes' basic data", UsecaseList.SHOW_ALL_PROCUREMENTITEMTYPES, UsecaseList.ADD_PROCUREMENTITEM, UsecaseList.UPDATE_PROCUREMENTITEM);

        List<Consumeitempurchase> consumeitempurchases = consumeitempurchaseDao.findAllNonePayed();

        return consumeitempurchases;
    }
}
