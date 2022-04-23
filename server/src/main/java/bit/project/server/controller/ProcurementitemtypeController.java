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
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import org.springframework.data.domain.PageRequest;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.entity.Procurementitemtype;
import bit.project.server.dao.ProcurementitemtypeDao;
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
@RequestMapping("/procurementitemtypes")
public class ProcurementitemtypeController{

    @Autowired
    private ProcurementitemtypeDao procurementitemtypeDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ProcurementitemtypeController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("procurementitemtype");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("PIT");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Procurementitemtype> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all procurementitemtypes", UsecaseList.SHOW_ALL_PROCUREMENTITEMTYPES);

        if(pageQuery.isEmptySearch()){
            return procurementitemtypeDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        String name = pageQuery.getSearchParam("name");

        List<Procurementitemtype> procurementitemtypes = procurementitemtypeDao.findAll(DEFAULT_SORT);
        Stream<Procurementitemtype> stream = procurementitemtypes.parallelStream();

        List<Procurementitemtype> filteredProcurementitemtypes = stream.filter(procurementitemtype -> {
            if(code!=null)
                if(!procurementitemtype.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(name!=null)
                if(!procurementitemtype.getName().toLowerCase().contains(name.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredProcurementitemtypes, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Procurementitemtype> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all procurementitemtypes' basic data", UsecaseList.SHOW_ALL_PROCUREMENTITEMTYPES, UsecaseList.ADD_PROCUREMENTITEM, UsecaseList.UPDATE_PROCUREMENTITEM);
        return procurementitemtypeDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Procurementitemtype get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get procurementitemtype", UsecaseList.SHOW_PROCUREMENTITEMTYPE_DETAILS);
        Optional<Procurementitemtype> optionalProcurementitemtype = procurementitemtypeDao.findById(id);
        if(optionalProcurementitemtype.isEmpty()) throw new ObjectNotFoundException("Procurementitemtype not found");
        return optionalProcurementitemtype.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete procurementitemtypes", UsecaseList.DELETE_PROCUREMENTITEMTYPE);

        try{
            if(procurementitemtypeDao.existsById(id)) procurementitemtypeDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this procurementitemtype already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Procurementitemtype procurementitemtype, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new procurementitemtype", UsecaseList.ADD_PROCUREMENTITEMTYPE);

        procurementitemtype.setTocreation(LocalDateTime.now());
        procurementitemtype.setCreator(authUser);
        procurementitemtype.setId(null);


        EntityValidator.validate(procurementitemtype);

        PersistHelper.save(()->{
            procurementitemtype.setCode(codeGenerator.getNextId(codeConfig));
            return procurementitemtypeDao.save(procurementitemtype);
        });

        return new ResourceLink(procurementitemtype.getId(), "/procurementitemtypes/"+procurementitemtype.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Procurementitemtype procurementitemtype, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update procurementitemtype details", UsecaseList.UPDATE_PROCUREMENTITEMTYPE);

        Optional<Procurementitemtype> optionalProcurementitemtype = procurementitemtypeDao.findById(id);
        if(optionalProcurementitemtype.isEmpty()) throw new ObjectNotFoundException("Procurementitemtype not found");
        Procurementitemtype oldProcurementitemtype = optionalProcurementitemtype.get();

        procurementitemtype.setId(id);
        procurementitemtype.setCode(oldProcurementitemtype.getCode());
        procurementitemtype.setCreator(oldProcurementitemtype.getCreator());
        procurementitemtype.setTocreation(oldProcurementitemtype.getTocreation());


        EntityValidator.validate(procurementitemtype);

        procurementitemtype = procurementitemtypeDao.save(procurementitemtype);
        return new ResourceLink(procurementitemtype.getId(), "/procurementitemtypes/"+procurementitemtype.getId());
    }

    @GetMapping("/byvendor/{id}")
    public List<Procurementitemtype> getAllByVendor(@PathVariable Integer id,PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all procurementitemtypes' basic data", UsecaseList.SHOW_ALL_PROCUREMENTITEMTYPES, UsecaseList.ADD_PROCUREMENTITEM, UsecaseList.UPDATE_PROCUREMENTITEM);
        ArrayList<Procurementitemtype> filteredProcurementitemtypes = new ArrayList<>();
        List<Procurementitemtype> procurementitemtypes = procurementitemtypeDao.findAll();
         procurementitemtypes.forEach(procurementitemtype -> {
             procurementitemtype.getVendorList().forEach(vendor -> {
                 if (vendor.getId().equals(id)){
                     filteredProcurementitemtypes.add(procurementitemtype);
                 }
             });
         });
         return filteredProcurementitemtypes;
    }

}
