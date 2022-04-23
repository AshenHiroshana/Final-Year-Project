package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.Branchroleassignment;
import bit.project.server.entity.User;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import bit.project.server.entity.Branchrole;
import bit.project.server.dao.BranchroleDao;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import bit.project.server.entity.Branchrolestatus;
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
@RequestMapping("/branchroles")
public class BranchroleController{

    @Autowired
    private BranchroleDao branchroleDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public BranchroleController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("branchrole");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("BRR");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Branchrole> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all branchroles", UsecaseList.SHOW_ALL_BRANCHROLES);

        if(pageQuery.isEmptySearch()){
            return branchroleDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        Integer branchId = pageQuery.getSearchParamAsInteger("branch");
        String name = pageQuery.getSearchParam("name");
        Integer branchrolestatusId = pageQuery.getSearchParamAsInteger("branchrolestatus");
        Integer departmentId = pageQuery.getSearchParamAsInteger("department");

        List<Branchrole> branchroles = branchroleDao.findAll(DEFAULT_SORT);
        Stream<Branchrole> stream = branchroles.parallelStream();

        List<Branchrole> filteredBranchroles = stream.filter(branchrole -> {
            if(branchId!=null)
                if(!branchrole.getBranch().getId().equals(branchId)) return false;
            if(name!=null)
                if(!branchrole.getName().toLowerCase().contains(name.toLowerCase())) return false;
            if(branchrolestatusId!=null)
                if(!branchrole.getBranchrolestatus().getId().equals(branchrolestatusId)) return false;
            if(departmentId!=null)
                if(!branchrole.getDepartment().getId().equals(departmentId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredBranchroles, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Branchrole> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all branchroles' basic data", UsecaseList.SHOW_ALL_BRANCHROLES, UsecaseList.ADD_BRANCHROLEASSIGNMENT, UsecaseList.UPDATE_BRANCHROLEASSIGNMENT);
        return branchroleDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Branchrole get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get branchrole", UsecaseList.SHOW_BRANCHROLE_DETAILS);
        Optional<Branchrole> optionalBranchrole = branchroleDao.findById(id);
        if(optionalBranchrole.isEmpty()) throw new ObjectNotFoundException("Branchrole not found");
        return optionalBranchrole.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete branchroles", UsecaseList.DELETE_BRANCHROLE);

        try{
            if(branchroleDao.existsById(id)) branchroleDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this branchrole already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Branchrole branchrole, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new branchrole", UsecaseList.ADD_BRANCHROLE);

        branchrole.setTocreation(LocalDateTime.now());
        branchrole.setCreator(authUser);
        branchrole.setId(null);
        branchrole.setBranchrolestatus(new Branchrolestatus(1));;


        EntityValidator.validate(branchrole);

        PersistHelper.save(()->{
            branchrole.setCode(codeGenerator.getNextId(codeConfig));
            return branchroleDao.save(branchrole);
        });

        return new ResourceLink(branchrole.getId(), "/branchroles/"+branchrole.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Branchrole branchrole, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update branchrole details", UsecaseList.UPDATE_BRANCHROLE);

        Optional<Branchrole> optionalBranchrole = branchroleDao.findById(id);
        if(optionalBranchrole.isEmpty()) throw new ObjectNotFoundException("Branchrole not found");
        Branchrole oldBranchrole = optionalBranchrole.get();

        branchrole.setId(id);
        branchrole.setCode(oldBranchrole.getCode());
        branchrole.setCreator(oldBranchrole.getCreator());
        branchrole.setTocreation(oldBranchrole.getTocreation());


        EntityValidator.validate(branchrole);

        branchrole = branchroleDao.save(branchrole);
        return new ResourceLink(branchrole.getId(), "/branchroles/"+branchrole.getId());
    }


    @GetMapping("bybranch/{id}")
    public List<Branchrole> getAllByBranch(@PathVariable Integer id, PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all branchroleassignments' basic data", UsecaseList.SHOW_ALL_BRANCHROLEASSIGNMENTS);
        return branchroleDao.findAllByBranch(id);
    }



}
