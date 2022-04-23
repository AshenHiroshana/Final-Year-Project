package bit.project.server.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.dao.FileDao;
import bit.project.server.entity.*;
import bit.project.server.dao.BranchDao;
import bit.project.server.util.helper.FileHelper;
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
@RequestMapping("/branches")
public class BranchController{

    @Autowired
    private BranchDao branchDao;

    @Autowired
    private FileDao fileDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public BranchController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("branch");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("BR");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Branch> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all branches", UsecaseList.SHOW_ALL_BRANCHES);

        if(pageQuery.isEmptySearch()){
            return branchDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        String city = pageQuery.getSearchParam("city");
        Integer branchstatusId = pageQuery.getSearchParamAsInteger("branchstatus");

        List<Branch> branches = branchDao.findAll(DEFAULT_SORT);
        Stream<Branch> stream = branches.parallelStream();

        List<Branch> filteredBranches = stream.filter(branch -> {
            if(code!=null)
                if(!branch.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(city!=null)
                if(!branch.getCity().toLowerCase().contains(city.toLowerCase())) return false;
            if(branchstatusId!=null)
                if(!branch.getBranchstatus().getId().equals(branchstatusId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredBranches, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Branch> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all branches' basic data", UsecaseList.SHOW_ALL_BRANCHES, UsecaseList.ADD_ATTENDANCE, UsecaseList.UPDATE_ATTENDANCE, UsecaseList.ADD_BILLPAYMENT, UsecaseList.UPDATE_BILLPAYMENT, UsecaseList.ADD_BRANCHROLE, UsecaseList.UPDATE_BRANCHROLE, UsecaseList.ADD_BRANCHROLEASSIGNMENT, UsecaseList.UPDATE_BRANCHROLEASSIGNMENT, UsecaseList.ADD_BRANCHSECTION, UsecaseList.UPDATE_BRANCHSECTION, UsecaseList.ADD_CONSUMEDISTRIBUTION, UsecaseList.UPDATE_CONSUMEDISTRIBUTION, UsecaseList.ADD_EMPLOYEE, UsecaseList.UPDATE_EMPLOYEE, UsecaseList.ADD_PRINTORDER, UsecaseList.UPDATE_PRINTORDER, UsecaseList.ADD_RENTAL, UsecaseList.UPDATE_RENTAL, UsecaseList.ADD_SERVICE, UsecaseList.UPDATE_SERVICE);
        return branchDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Branch get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get branch", UsecaseList.SHOW_BRANCH_DETAILS);
        Optional<Branch> optionalBranch = branchDao.findById(id);
        if(optionalBranch.isEmpty()) throw new ObjectNotFoundException("Branch not found");
        return optionalBranch.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete branches", UsecaseList.DELETE_BRANCH);

        try{
            if(branchDao.existsById(id)) branchDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this branch already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Branch branch, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new branch", UsecaseList.ADD_BRANCH);

        branch.setTocreation(LocalDateTime.now());
        branch.setCreator(authUser);
        branch.setId(null);
        branch.setBranchstatus(new Branchstatus(1));;

        String maplink = branch.getMaplink();
        String[] maplinkArray = null;
        if (!maplink.isEmpty()) {
            maplinkArray= maplink.split("\"");
            if (maplinkArray.length > 2) branch.setMaplink(maplinkArray[1]);
        }

        for(Branchbranchplan branchbranchplan : branch.getBranchbranchplanList()) branchbranchplan.setBranch(branch);

        EntityValidator.validate(branch);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(branch.getPrimarycontact() != null){
            Branch branchByPrimarycontact = branchDao.findByPrimarycontact(branch.getPrimarycontact());
            if(branchByPrimarycontact!=null) errorBag.add("primarycontact","primarycontact already exists");
        }

        if(branch.getFax() != null){
            Branch branchByFax = branchDao.findByFax(branch.getFax());
            if(branchByFax!=null) errorBag.add("fax","fax already exists");
        }

        if(branch.getEmail() != null){
            Branch branchByEmail = branchDao.findByEmail(branch.getEmail());
            if(branchByEmail!=null) errorBag.add("email","email already exists");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        PersistHelper.save(()->{
            branch.setCode(codeGenerator.getNextId(codeConfig));
            return branchDao.save(branch);
        });

        return new ResourceLink(branch.getId(), "/branches/"+branch.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Branch branch, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update branch details", UsecaseList.UPDATE_BRANCH);

        Optional<Branch> optionalBranch = branchDao.findById(id);
        if(optionalBranch.isEmpty()) throw new ObjectNotFoundException("Branch not found");
        Branch oldBranch = optionalBranch.get();

        branch.setId(id);
        branch.setCode(oldBranch.getCode());
        branch.setCreator(oldBranch.getCreator());
        branch.setTocreation(oldBranch.getTocreation());


        String maplink = branch.getMaplink();
        String[] maplinkArray = null;
        if (!maplink.isEmpty()) {
            maplinkArray= maplink.split("\"");
            if (maplinkArray.length > 2) branch.setMaplink(maplinkArray[1]);
        }

        for(Branchbranchplan branchbranchplan : branch.getBranchbranchplanList()) branchbranchplan.setBranch(branch);

        EntityValidator.validate(branch);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(branch.getPrimarycontact() != null){
            Branch branchByPrimarycontact = branchDao.findByPrimarycontact(branch.getPrimarycontact());
            if(branchByPrimarycontact!=null)
                if(!branchByPrimarycontact.getId().equals(id))
                    errorBag.add("primarycontact","primarycontact already exists");
        }

        if(branch.getFax() != null){
            Branch branchByFax = branchDao.findByFax(branch.getFax());
            if(branchByFax!=null)
                if(!branchByFax.getId().equals(id))
                    errorBag.add("fax","fax already exists");
        }

        if(branch.getEmail() != null){
            Branch branchByEmail = branchDao.findByEmail(branch.getEmail());
            if(branchByEmail!=null)
                if(!branchByEmail.getId().equals(id))
                    errorBag.add("email","email already exists");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        branch = branchDao.save(branch);
        return new ResourceLink(branch.getId(), "/branches/"+branch.getId());
    }

    @GetMapping("/{id}/photo")
    public HashMap<String, String> getPhoto(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get user photo", UsecaseList.SHOW_BRANCH_DETAILS);

        Optional<Branch> optionalEmployee = branchDao.findById(id);

        Optional<File> optionalFile = fileDao.findFileById(optionalEmployee.get().getPhoto());

        if(optionalFile.isEmpty()) {
            throw new ObjectNotFoundException("Photo not found");
        }

        File photo = optionalFile.get();
        HashMap<String, String> data = new HashMap<>();

        data.put("file", FileHelper.byteArrayToBase64(photo.getFile(), photo.getFilemimetype()));

        return data;
    }

    @GetMapping("/{id}/photos")
    public List getPhotos(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get branch photo", UsecaseList.SHOW_BRANCH_DETAILS);

        Optional<Branch> optionalBranch = branchDao.findById(id);
        if(optionalBranch.isEmpty()) throw new ObjectNotFoundException("Branch not found");
        Branch branch = optionalBranch.get();

        List<File> files = new ArrayList<File>();

        branch.getBranchbranchplanList().forEach((file -> {
            Optional<File> optionalFile = fileDao.findFileById(file.getBranchplan());
            if (!optionalFile.isEmpty()){
                files.add(optionalFile.get());
            }
        }));


        if(files.isEmpty()) {
            throw new ObjectNotFoundException("Photos not found");
        }

        List fileList = new ArrayList();

        files.forEach(file -> {
            HashMap<String, String> data = new HashMap<>();
            data.put("file", FileHelper.byteArrayToBase64(file.getFile(), file.getFilemimetype()));
            fileList.add(data);

        });

        return fileList;
    }
}
