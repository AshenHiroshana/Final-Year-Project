package bit.project.server.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.dao.FileDao;
import bit.project.server.entity.*;
import bit.project.server.util.helper.FileHelper;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.dao.BranchsectionDao;
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
@RequestMapping("/branchsections")
public class BranchsectionController{

    @Autowired
    private BranchsectionDao branchsectionDao;

    @Autowired
    private FileDao fileDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public BranchsectionController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("branchsection");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("BRS");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Branchsection> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all branchsections", UsecaseList.SHOW_ALL_BRANCHSECTIONS);

        if(pageQuery.isEmptySearch()){
            return branchsectionDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer branchsectionstatusId = pageQuery.getSearchParamAsInteger("branchsectionstatus");
        Integer branchsectiontypeId = pageQuery.getSearchParamAsInteger("branchsectiontype");
        Integer branchId = pageQuery.getSearchParamAsInteger("branch");

        List<Branchsection> branchsections = branchsectionDao.findAll(DEFAULT_SORT);
        Stream<Branchsection> stream = branchsections.parallelStream();

        List<Branchsection> filteredBranchsections = stream.filter(branchsection -> {
            if(code!=null)
                if(!branchsection.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(branchsectionstatusId!=null)
                if(!branchsection.getBranchsectionstatus().getId().equals(branchsectionstatusId)) return false;
            if(branchsectiontypeId!=null)
                if(!branchsection.getBranchsectiontype().getId().equals(branchsectiontypeId)) return false;
            if(branchId!=null)
                if(!branchsection.getBranch().getId().equals(branchId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredBranchsections, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Branchsection> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all branchsections' basic data", UsecaseList.SHOW_ALL_BRANCHSECTIONS, UsecaseList.ADD_PROCUREMENTALLOCATION, UsecaseList.UPDATE_PROCUREMENTALLOCATION);
        return branchsectionDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Branchsection get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get branchsection", UsecaseList.SHOW_BRANCHSECTION_DETAILS);
        Optional<Branchsection> optionalBranchsection = branchsectionDao.findById(id);
        if(optionalBranchsection.isEmpty()) throw new ObjectNotFoundException("Branchsection not found");
        return optionalBranchsection.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete branchsections", UsecaseList.DELETE_BRANCHSECTION);

        try{
            if(branchsectionDao.existsById(id)) branchsectionDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this branchsection already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Branchsection branchsection, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new branchsection", UsecaseList.ADD_BRANCHSECTION);

        branchsection.setTocreation(LocalDateTime.now());
        branchsection.setCreator(authUser);
        branchsection.setId(null);
        branchsection.setBranchsectionstatus(new Branchsectionstatus(1));;


        EntityValidator.validate(branchsection);

        PersistHelper.save(()->{
            branchsection.setCode(codeGenerator.getNextId(codeConfig));
            return branchsectionDao.save(branchsection);
        });

        return new ResourceLink(branchsection.getId(), "/branchsections/"+branchsection.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Branchsection branchsection, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update branchsection details", UsecaseList.UPDATE_BRANCHSECTION);

        Optional<Branchsection> optionalBranchsection = branchsectionDao.findById(id);
        if(optionalBranchsection.isEmpty()) throw new ObjectNotFoundException("Branchsection not found");
        Branchsection oldBranchsection = optionalBranchsection.get();

        branchsection.setId(id);
        branchsection.setCode(oldBranchsection.getCode());
        branchsection.setCreator(oldBranchsection.getCreator());
        branchsection.setTocreation(oldBranchsection.getTocreation());


        EntityValidator.validate(branchsection);

        branchsection = branchsectionDao.save(branchsection);
        return new ResourceLink(branchsection.getId(), "/branchsections/"+branchsection.getId());
    }

    @GetMapping("/bybranch/{id}")
    public List<Branchsection> getAllByBranch(@PathVariable Integer id,PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all branchsections' basic data", UsecaseList.SHOW_ALL_BRANCHSECTIONS, UsecaseList.ADD_PROCUREMENTALLOCATION, UsecaseList.UPDATE_PROCUREMENTALLOCATION);
        return branchsectionDao.findAllByBranch(id);
    }

    @GetMapping("/{id}/photo")
    public HashMap<String, String> getPhoto(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get user photo", UsecaseList.SHOW_BRANCH_DETAILS);

        Optional<Branchsection> optionalEmployee = branchsectionDao.findById(id);

        Optional<File> optionalFile = fileDao.findFileById(optionalEmployee.get().getPhoto());

        if(optionalFile.isEmpty()) {
            throw new ObjectNotFoundException("Photo not found");
        }

        File photo = optionalFile.get();
        HashMap<String, String> data = new HashMap<>();

        data.put("file", FileHelper.byteArrayToBase64(photo.getFile(), photo.getFilemimetype()));

        return data;
    }

}
