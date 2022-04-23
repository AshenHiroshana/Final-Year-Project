package bit.project.server.controller;

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
import bit.project.server.entity.Procurementallocation;
import bit.project.server.dao.ProcurementallocationDao;
import bit.project.server.util.validation.EntityValidator;
import bit.project.server.util.exception.ConflictException;
import bit.project.server.util.validation.ValidationErrorBag;
import bit.project.server.util.security.AccessControlManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import bit.project.server.util.exception.DataValidationException;
import bit.project.server.util.exception.ObjectNotFoundException;
import bit.project.server.entity.Procurementallocationprocurementitem;

@CrossOrigin
@RestController
@RequestMapping("/procurementallocations")
public class ProcurementallocationController{

    @Autowired
    private ProcurementallocationDao procurementallocationDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ProcurementallocationController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("procurementallocation");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("PIA");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Procurementallocation> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all procurementallocations", UsecaseList.SHOW_ALL_PROCUREMENTALLOCATIONS);

        if(pageQuery.isEmptySearch()){
            return procurementallocationDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer branchsectionId = pageQuery.getSearchParamAsInteger("branchsection");

        List<Procurementallocation> procurementallocations = procurementallocationDao.findAll(DEFAULT_SORT);
        Stream<Procurementallocation> stream = procurementallocations.parallelStream();

        List<Procurementallocation> filteredProcurementallocations = stream.filter(procurementallocation -> {
            if(code!=null)
                if(!procurementallocation.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(branchsectionId!=null)
                if(!procurementallocation.getBranchsection().getId().equals(branchsectionId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredProcurementallocations, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Procurementallocation> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all procurementallocations' basic data", UsecaseList.SHOW_ALL_PROCUREMENTALLOCATIONS);
        return procurementallocationDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Procurementallocation get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get procurementallocation", UsecaseList.SHOW_PROCUREMENTALLOCATION_DETAILS);
        Optional<Procurementallocation> optionalProcurementallocation = procurementallocationDao.findById(id);
        if(optionalProcurementallocation.isEmpty()) throw new ObjectNotFoundException("Procurementallocation not found");
        return optionalProcurementallocation.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete procurementallocations", UsecaseList.DELETE_PROCUREMENTALLOCATION);

        try{
            if(procurementallocationDao.existsById(id)) procurementallocationDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this procurementallocation already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Procurementallocation procurementallocation, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new procurementallocation", UsecaseList.ADD_PROCUREMENTALLOCATION);

        procurementallocation.setTocreation(LocalDateTime.now());
        procurementallocation.setCreator(authUser);
        procurementallocation.setId(null);

        for(Procurementallocationprocurementitem procurementallocationprocurementitem : procurementallocation.getProcurementallocationprocurementitemList()) procurementallocationprocurementitem.setProcurementallocation(procurementallocation);

        EntityValidator.validate(procurementallocation);

        PersistHelper.save(()->{
            procurementallocation.setCode(codeGenerator.getNextId(codeConfig));
            return procurementallocationDao.save(procurementallocation);
        });

        return new ResourceLink(procurementallocation.getId(), "/procurementallocations/"+procurementallocation.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Procurementallocation procurementallocation, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update procurementallocation details", UsecaseList.UPDATE_PROCUREMENTALLOCATION);

        Optional<Procurementallocation> optionalProcurementallocation = procurementallocationDao.findById(id);
        if(optionalProcurementallocation.isEmpty()) throw new ObjectNotFoundException("Procurementallocation not found");
        Procurementallocation oldProcurementallocation = optionalProcurementallocation.get();

        procurementallocation.setId(id);
        procurementallocation.setCode(oldProcurementallocation.getCode());
        procurementallocation.setCreator(oldProcurementallocation.getCreator());
        procurementallocation.setTocreation(oldProcurementallocation.getTocreation());

        for(Procurementallocationprocurementitem procurementallocationprocurementitem : procurementallocation.getProcurementallocationprocurementitemList()) procurementallocationprocurementitem.setProcurementallocation(procurementallocation);

        EntityValidator.validate(procurementallocation);

        procurementallocation = procurementallocationDao.save(procurementallocation);
        return new ResourceLink(procurementallocation.getId(), "/procurementallocations/"+procurementallocation.getId());
    }

}