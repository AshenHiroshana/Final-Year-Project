package bit.project.server.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.Branchrole;
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
import bit.project.server.entity.Branchroleassignment;
import bit.project.server.dao.BranchroleassignmentDao;
import bit.project.server.util.validation.EntityValidator;
import bit.project.server.util.exception.ConflictException;
import bit.project.server.entity.Branchroleassignmentstatus;
import bit.project.server.util.validation.ValidationErrorBag;
import bit.project.server.util.security.AccessControlManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import bit.project.server.util.exception.DataValidationException;
import bit.project.server.util.exception.ObjectNotFoundException;

@CrossOrigin
@RestController
@RequestMapping("/branchroleassignments")
public class BranchroleassignmentController{

    @Autowired
    private BranchroleassignmentDao branchroleassignmentDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public BranchroleassignmentController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("branchroleassignment");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("BRRA");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Branchroleassignment> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all branchroleassignments", UsecaseList.SHOW_ALL_BRANCHROLEASSIGNMENTS);

        if(pageQuery.isEmptySearch()){
            return branchroleassignmentDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer branchId = pageQuery.getSearchParamAsInteger("branch");
        Integer employeeId = pageQuery.getSearchParamAsInteger("employee");
        Integer branchroleassignmentstatusId = pageQuery.getSearchParamAsInteger("branchroleassignmentstatus");

        List<Branchroleassignment> branchroleassignments = branchroleassignmentDao.findAll(DEFAULT_SORT);
        Stream<Branchroleassignment> stream = branchroleassignments.parallelStream();

        List<Branchroleassignment> filteredBranchroleassignments = stream.filter(branchroleassignment -> {
            if(code!=null)
                if(!branchroleassignment.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(branchId!=null)
                if(!branchroleassignment.getBranch().getId().equals(branchId)) return false;
            if(employeeId!=null)
                if(!branchroleassignment.getEmployee().getId().equals(employeeId)) return false;
            if(branchroleassignmentstatusId!=null)
                if(!branchroleassignment.getBranchroleassignmentstatus().getId().equals(branchroleassignmentstatusId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredBranchroleassignments, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Branchroleassignment> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all branchroleassignments' basic data", UsecaseList.SHOW_ALL_BRANCHROLEASSIGNMENTS);
        return branchroleassignmentDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Branchroleassignment get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get branchroleassignment", UsecaseList.SHOW_BRANCHROLEASSIGNMENT_DETAILS);
        Optional<Branchroleassignment> optionalBranchroleassignment = branchroleassignmentDao.findById(id);
        if(optionalBranchroleassignment.isEmpty()) throw new ObjectNotFoundException("Branchroleassignment not found");
        return optionalBranchroleassignment.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete branchroleassignments", UsecaseList.DELETE_BRANCHROLEASSIGNMENT);

        try{
            if(branchroleassignmentDao.existsById(id)) branchroleassignmentDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this branchroleassignment already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Branchroleassignment branchroleassignment, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new branchroleassignment", UsecaseList.ADD_BRANCHROLEASSIGNMENT);

        branchroleassignment.setTocreation(LocalDateTime.now());
        branchroleassignment.setCreator(authUser);
        branchroleassignment.setId(null);
        branchroleassignment.setBranchroleassignmentstatus(new Branchroleassignmentstatus(1));;


        EntityValidator.validate(branchroleassignment);

        PersistHelper.save(()->{
            branchroleassignment.setCode(codeGenerator.getNextId(codeConfig));
            return branchroleassignmentDao.save(branchroleassignment);
        });

        return new ResourceLink(branchroleassignment.getId(), "/branchroleassignments/"+branchroleassignment.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Branchroleassignment branchroleassignment, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update branchroleassignment details", UsecaseList.UPDATE_BRANCHROLEASSIGNMENT);

        Optional<Branchroleassignment> optionalBranchroleassignment = branchroleassignmentDao.findById(id);
        if(optionalBranchroleassignment.isEmpty()) throw new ObjectNotFoundException("Branchroleassignment not found");
        Branchroleassignment oldBranchroleassignment = optionalBranchroleassignment.get();

        branchroleassignment.setId(id);
        branchroleassignment.setCode(oldBranchroleassignment.getCode());
        branchroleassignment.setCreator(oldBranchroleassignment.getCreator());
        branchroleassignment.setTocreation(oldBranchroleassignment.getTocreation());


        EntityValidator.validate(branchroleassignment);

        branchroleassignment = branchroleassignmentDao.save(branchroleassignment);
        return new ResourceLink(branchroleassignment.getId(), "/branchroleassignments/"+branchroleassignment.getId());
    }

    @GetMapping("/forsalaycalculation/{id}")
    public List<Branchroleassignment> getAllForSalaryCalculation(@PathVariable Integer id,PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all branchroleassignments' basic data", UsecaseList.SHOW_ALL_BRANCHROLEASSIGNMENTS);
        List<Branchroleassignment> branchroleassignmentList =  branchroleassignmentDao.findAll();
        ArrayList<Branchroleassignment> branchroleassignments = new ArrayList<>();
        branchroleassignmentList.forEach(branchroleassignment -> {
            if (branchroleassignment.getEmployee().getId().equals(id)){
                branchroleassignments.add(branchroleassignment);
            }
        });
        return branchroleassignments;
    }



}
