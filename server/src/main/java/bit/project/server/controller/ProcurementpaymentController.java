package bit.project.server.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.Procurementitem;
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
import org.springframework.data.domain.PageRequest;
import bit.project.server.entity.Procurementpayment;
import bit.project.server.dao.ProcurementpaymentDao;
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
@RequestMapping("/procurementpayments")
public class ProcurementpaymentController{

    @Autowired
    private ProcurementpaymentDao procurementpaymentDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ProcurementpaymentController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("procurementpayment");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("PP");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Procurementpayment> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all procurementpayments", UsecaseList.SHOW_ALL_PROCUREMENTPAYMENTS);

        if(pageQuery.isEmptySearch()){
            return procurementpaymentDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer procurementitempurchaseId = pageQuery.getSearchParamAsInteger("procurementitempurchase");
        Integer paymentstatusId = pageQuery.getSearchParamAsInteger("paymentstatus");
        Integer paymenttypeId = pageQuery.getSearchParamAsInteger("paymenttype");


        LocalDate startDate = LocalDate.parse(pageQuery.getSearchParam("startDate"));
        LocalDate endtDate = LocalDate.parse(pageQuery.getSearchParam("endtDate"));

        List<Procurementpayment> procurementpayments = procurementpaymentDao.findAll(DEFAULT_SORT);
        Stream<Procurementpayment> stream = procurementpayments.parallelStream();

        List<Procurementpayment> filteredProcurementpayments = stream.filter(procurementpayment -> {

            if (!(startDate.isEqual(LocalDate.parse("1970-01-01")) && endtDate.isEqual(LocalDate.parse("1970-01-01"))))
                if(!((procurementpayment.getDate().isAfter(startDate) && procurementpayment.getDate().isBefore(endtDate))
                        || procurementpayment.getDate().isEqual(startDate) || procurementpayment.getDate().isEqual(endtDate)))
                    return false;

            if(code!=null)
                if(!procurementpayment.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(procurementitempurchaseId!=null)
                if(!procurementpayment.getProcurementitempurchase().getId().equals(procurementitempurchaseId)) return false;
            if(paymentstatusId!=null)
                if(!procurementpayment.getPaymentstatus().getId().equals(paymentstatusId)) return false;
            if(paymenttypeId!=null)
                if(!procurementpayment.getPaymenttype().getId().equals(paymenttypeId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredProcurementpayments, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Procurementpayment> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all procurementpayments' basic data", UsecaseList.SHOW_ALL_PROCUREMENTPAYMENTS);
        return procurementpaymentDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Procurementpayment get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get procurementpayment", UsecaseList.SHOW_PROCUREMENTPAYMENT_DETAILS);
        Optional<Procurementpayment> optionalProcurementpayment = procurementpaymentDao.findById(id);
        if(optionalProcurementpayment.isEmpty()) throw new ObjectNotFoundException("Procurementpayment not found");
        return optionalProcurementpayment.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete procurementpayments", UsecaseList.DELETE_PROCUREMENTPAYMENT);

        try{
            if(procurementpaymentDao.existsById(id)) procurementpaymentDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this procurementpayment already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Procurementpayment procurementpayment, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new procurementpayment", UsecaseList.ADD_PROCUREMENTPAYMENT);

        procurementpayment.setTocreation(LocalDateTime.now());
        procurementpayment.setCreator(authUser);
        procurementpayment.setId(null);
        procurementpayment.setDate(LocalDate.now());
        procurementpayment.setPaymentstatus(new Paymentstatus(1));;
        if (procurementpayment.getPaymenttype().getId().equals(2)){
            procurementpayment.setPaymentstatus(new Paymentstatus(2));;
        }


        EntityValidator.validate(procurementpayment);

        PersistHelper.save(()->{
            procurementpayment.setCode(codeGenerator.getNextId(codeConfig));
            return procurementpaymentDao.save(procurementpayment);
        });

        return new ResourceLink(procurementpayment.getId(), "/procurementpayments/"+procurementpayment.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Procurementpayment procurementpayment, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update procurementpayment details", UsecaseList.UPDATE_PROCUREMENTPAYMENT);

        Optional<Procurementpayment> optionalProcurementpayment = procurementpaymentDao.findById(id);
        if(optionalProcurementpayment.isEmpty()) throw new ObjectNotFoundException("Procurementpayment not found");
        Procurementpayment oldProcurementpayment = optionalProcurementpayment.get();

        procurementpayment.setId(id);
        procurementpayment.setCode(oldProcurementpayment.getCode());
        procurementpayment.setCreator(oldProcurementpayment.getCreator());
        procurementpayment.setTocreation(oldProcurementpayment.getTocreation());
        if (procurementpayment.getPaymenttype().getId().equals(1)){
            procurementpayment.setPaymentstatus(new Paymentstatus(1));
        }
        if (procurementpayment.getPaymenttype().getId().equals(2) && oldProcurementpayment.getPaymenttype().getId().equals(1)){
            procurementpayment.setPaymentstatus(new Paymentstatus(2));
        }


        EntityValidator.validate(procurementpayment);

        procurementpayment = procurementpaymentDao.save(procurementpayment);
        return new ResourceLink(procurementpayment.getId(), "/procurementpayments/"+procurementpayment.getId());
    }

    @GetMapping("/paymentbypurchase/{id}")
    public List<Procurementpayment> getAllPaymentByPurchase(@PathVariable Integer id, PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all procurementitems' basic data", UsecaseList.SHOW_ALL_PROCUREMENTITEMS, UsecaseList.ADD_AUCTION, UsecaseList.UPDATE_AUCTION, UsecaseList.ADD_PROCUREMENTREFUND, UsecaseList.UPDATE_PROCUREMENTREFUND);
        List<Procurementpayment> procurementpayments =  procurementpaymentDao.findAll(DEFAULT_SORT);
        ArrayList<Procurementpayment> filteredProcurementpayments = new ArrayList<>();
        procurementpayments.forEach(procurementpayment -> {
            if (procurementpayment.getProcurementitempurchase().getId().equals(id)){
                filteredProcurementpayments.add(procurementpayment);
            }
        });
        return filteredProcurementpayments;
    }

}
