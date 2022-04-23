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
import bit.project.server.entity.Paymentstatus;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import bit.project.server.entity.Procurementrefund;
import bit.project.server.dao.ProcurementrefundDao;
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
@RequestMapping("/procurementrefunds")
public class ProcurementrefundController{

    @Autowired
    private ProcurementrefundDao procurementrefundDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ProcurementrefundController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("procurementrefund");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("PPR");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Procurementrefund> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all procurementrefunds", UsecaseList.SHOW_ALL_PROCUREMENTREFUNDS);

        if(pageQuery.isEmptySearch()){
            return procurementrefundDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer procurementitempurchaseId = pageQuery.getSearchParamAsInteger("procurementitempurchase");
        Integer paymentstatusId = pageQuery.getSearchParamAsInteger("paymentstatus");
        Integer paymenttypeId = pageQuery.getSearchParamAsInteger("paymenttype");

        List<Procurementrefund> procurementrefunds = procurementrefundDao.findAll(DEFAULT_SORT);
        Stream<Procurementrefund> stream = procurementrefunds.parallelStream();

        List<Procurementrefund> filteredProcurementrefunds = stream.filter(procurementrefund -> {
            if(code!=null)
                if(!procurementrefund.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(procurementitempurchaseId!=null)
                if(!procurementrefund.getProcurementitempurchase().getId().equals(procurementitempurchaseId)) return false;
            if(paymentstatusId!=null)
                if(!procurementrefund.getPaymentstatus().getId().equals(paymentstatusId)) return false;
            if(paymenttypeId!=null)
                if(!procurementrefund.getPaymenttype().getId().equals(paymenttypeId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredProcurementrefunds, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Procurementrefund> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all procurementrefunds' basic data", UsecaseList.SHOW_ALL_PROCUREMENTREFUNDS);
        return procurementrefundDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Procurementrefund get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get procurementrefund", UsecaseList.SHOW_PROCUREMENTREFUND_DETAILS);
        Optional<Procurementrefund> optionalProcurementrefund = procurementrefundDao.findById(id);
        if(optionalProcurementrefund.isEmpty()) throw new ObjectNotFoundException("Procurementrefund not found");
        return optionalProcurementrefund.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete procurementrefunds", UsecaseList.DELETE_PROCUREMENTREFUND);

        try{
            if(procurementrefundDao.existsById(id)) procurementrefundDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this procurementrefund already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Procurementrefund procurementrefund, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new procurementrefund", UsecaseList.ADD_PROCUREMENTREFUND);

        procurementrefund.setTocreation(LocalDateTime.now());
        procurementrefund.setCreator(authUser);
        procurementrefund.setId(null);
        procurementrefund.setPaymentstatus(new Paymentstatus(1));;
        if (procurementrefund.getPaymenttype().getId().equals(2)){
            procurementrefund.setPaymentstatus(new Paymentstatus(2));;
        }
        procurementrefund.setDate(LocalDate.now());




        EntityValidator.validate(procurementrefund);

        PersistHelper.save(()->{
            procurementrefund.setCode(codeGenerator.getNextId(codeConfig));
            return procurementrefundDao.save(procurementrefund);
        });

        return new ResourceLink(procurementrefund.getId(), "/procurementrefunds/"+procurementrefund.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Procurementrefund procurementrefund, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update procurementrefund details", UsecaseList.UPDATE_PROCUREMENTREFUND);

        Optional<Procurementrefund> optionalProcurementrefund = procurementrefundDao.findById(id);
        if(optionalProcurementrefund.isEmpty()) throw new ObjectNotFoundException("Procurementrefund not found");
        Procurementrefund oldProcurementrefund = optionalProcurementrefund.get();

        procurementrefund.setId(id);
        procurementrefund.setCode(oldProcurementrefund.getCode());
        procurementrefund.setCreator(oldProcurementrefund.getCreator());
        procurementrefund.setTocreation(oldProcurementrefund.getTocreation());


        EntityValidator.validate(procurementrefund);

        procurementrefund = procurementrefundDao.save(procurementrefund);
        return new ResourceLink(procurementrefund.getId(), "/procurementrefunds/"+procurementrefund.getId());
    }

}
