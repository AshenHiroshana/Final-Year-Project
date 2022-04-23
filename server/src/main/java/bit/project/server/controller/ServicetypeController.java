package bit.project.server.controller;

import java.util.ArrayList;
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
import bit.project.server.entity.Servicetype;
import bit.project.server.dao.ServicetypeDao;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import org.springframework.data.domain.PageRequest;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.helper.CodeGenerator;
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
@RequestMapping("/servicetypes")
public class ServicetypeController{

    @Autowired
    private ServicetypeDao servicetypeDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ServicetypeController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("servicetype");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("ST");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Servicetype> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all servicetypes", UsecaseList.SHOW_ALL_SERVICETYPES);

        if(pageQuery.isEmptySearch()){
            return servicetypeDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        String name = pageQuery.getSearchParam("name");

        List<Servicetype> servicetypes = servicetypeDao.findAll(DEFAULT_SORT);
        Stream<Servicetype> stream = servicetypes.parallelStream();

        List<Servicetype> filteredServicetypes = stream.filter(servicetype -> {
            if(code!=null)
                if(!servicetype.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(name!=null)
                if(!servicetype.getName().toLowerCase().contains(name.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredServicetypes, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Servicetype> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all servicetypes' basic data", UsecaseList.SHOW_ALL_SERVICETYPES, UsecaseList.ADD_SERVICE, UsecaseList.UPDATE_SERVICE);
        return servicetypeDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Servicetype get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get servicetype", UsecaseList.SHOW_SERVICETYPE_DETAILS);
        Optional<Servicetype> optionalServicetype = servicetypeDao.findById(id);
        if(optionalServicetype.isEmpty()) throw new ObjectNotFoundException("Servicetype not found");
        return optionalServicetype.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete servicetypes", UsecaseList.DELETE_SERVICETYPE);

        try{
            if(servicetypeDao.existsById(id)) servicetypeDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this servicetype already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Servicetype servicetype, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new servicetype", UsecaseList.ADD_SERVICETYPE);

        servicetype.setTocreation(LocalDateTime.now());
        servicetype.setCreator(authUser);
        servicetype.setId(null);


        EntityValidator.validate(servicetype);

        PersistHelper.save(()->{
            servicetype.setCode(codeGenerator.getNextId(codeConfig));
            return servicetypeDao.save(servicetype);
        });

        return new ResourceLink(servicetype.getId(), "/servicetypes/"+servicetype.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Servicetype servicetype, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update servicetype details", UsecaseList.UPDATE_SERVICETYPE);

        Optional<Servicetype> optionalServicetype = servicetypeDao.findById(id);
        if(optionalServicetype.isEmpty()) throw new ObjectNotFoundException("Servicetype not found");
        Servicetype oldServicetype = optionalServicetype.get();

        servicetype.setId(id);
        servicetype.setCode(oldServicetype.getCode());
        servicetype.setCreator(oldServicetype.getCreator());
        servicetype.setTocreation(oldServicetype.getTocreation());


        EntityValidator.validate(servicetype);

        servicetype = servicetypeDao.save(servicetype);
        return new ResourceLink(servicetype.getId(), "/servicetypes/"+servicetype.getId());
    }

    @GetMapping("/byvendor/{id}")
    public List<Servicetype> getAllByVendorc(@PathVariable Integer id,PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all servicetypes' basic data", UsecaseList.SHOW_ALL_SERVICETYPES, UsecaseList.ADD_SERVICE, UsecaseList.UPDATE_SERVICE);
        List<Servicetype> servicetypes =  servicetypeDao.findAll();
        ArrayList<Servicetype> filteredServicetypes = new ArrayList<>();
        servicetypes.forEach(servicetype -> {
            servicetype.getVendorList().forEach(vendor -> {
                if (vendor.getId().equals(id)){
                    filteredServicetypes.add(servicetype);
                }
            });
        });
        return filteredServicetypes;
    }

}
