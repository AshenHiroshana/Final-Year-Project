package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.dao.NotificationDao;
import bit.project.server.dao.UserDao;
import bit.project.server.entity.Notification;
import bit.project.server.entity.User;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import bit.project.server.entity.Designation;
import bit.project.server.dao.DesignationDao;
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
@RequestMapping("/designations")
public class DesignationController{

    @Autowired
    private DesignationDao designationDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private NotificationDao notificationDao;



    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public DesignationController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("designation");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("DES");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Designation> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all designations", UsecaseList.SHOW_ALL_DESIGNATIONS);

        if(pageQuery.isEmptySearch()){
            return designationDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer departmentId = pageQuery.getSearchParamAsInteger("department");

        List<Designation> designations = designationDao.findAll(DEFAULT_SORT);
        Stream<Designation> stream = designations.parallelStream();

        List<Designation> filteredDesignations = stream.filter(designation -> {
            if(code!=null)
                if(!designation.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(departmentId!=null)
                if(!designation.getDepartment().getId().equals(departmentId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredDesignations, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Designation> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all designations' basic data", UsecaseList.SHOW_ALL_DESIGNATIONS, UsecaseList.ADD_APPOINTMENT, UsecaseList.UPDATE_APPOINTMENT);
        return designationDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Designation get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get designation", UsecaseList.SHOW_DESIGNATION_DETAILS);
        Optional<Designation> optionalDesignation = designationDao.findById(id);
        if(optionalDesignation.isEmpty()) throw new ObjectNotFoundException("Designation not found");
        return optionalDesignation.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete designations", UsecaseList.DELETE_DESIGNATION);

        try{
            if(designationDao.existsById(id)) designationDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this designation already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Designation designation, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new designation", UsecaseList.ADD_DESIGNATION);

        designation.setTocreation(LocalDateTime.now());
        designation.setCreator(authUser);
        designation.setId(null);


        EntityValidator.validate(designation);

        PersistHelper.save(()->{
            designation.setCode(codeGenerator.getNextId(codeConfig));
            return designationDao.save(designation);
        });


        return new ResourceLink(designation.getId(), "/designations/"+designation.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Designation designation, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update designation details", UsecaseList.UPDATE_DESIGNATION);

        Optional<Designation> optionalDesignation = designationDao.findById(id);
        if(optionalDesignation.isEmpty()) throw new ObjectNotFoundException("Designation not found");
        Designation oldDesignation = optionalDesignation.get();

        designation.setId(id);
        designation.setCode(oldDesignation.getCode());
        designation.setCreator(oldDesignation.getCreator());
        designation.setTocreation(oldDesignation.getTocreation());


        EntityValidator.validate(designation);

        designation = designationDao.save(designation);
        return new ResourceLink(designation.getId(), "/designations/"+designation.getId());
    }

}
