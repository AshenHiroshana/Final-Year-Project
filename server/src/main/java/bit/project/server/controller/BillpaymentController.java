package bit.project.server.controller;

import java.time.LocalDate;
import java.util.*;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import bit.project.server.entity.Billpayment;
import bit.project.server.dao.BillpaymentDao;
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
@RequestMapping("/billpayments")
public class BillpaymentController{

    @Autowired
    private BillpaymentDao billpaymentDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public BillpaymentController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("billpayment");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("BP");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Billpayment> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all billpayments", UsecaseList.SHOW_ALL_BILLPAYMENTS);

        if(pageQuery.isEmptySearch()){
            return billpaymentDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer billpaymenttypeId = pageQuery.getSearchParamAsInteger("billpaymenttype");
        Integer branchId = pageQuery.getSearchParamAsInteger("branch");
        LocalDate startDate = LocalDate.parse(pageQuery.getSearchParam("startDate"));
        LocalDate endtDate = LocalDate.parse(pageQuery.getSearchParam("endtDate"));


        List<Billpayment> billpayments = billpaymentDao.findAll(DEFAULT_SORT);
        Stream<Billpayment> stream = billpayments.parallelStream();

        List<Billpayment> filteredBillpayments = stream.filter(billpayment -> {

            if (!(startDate.isEqual(LocalDate.parse("1970-01-01")) && endtDate.isEqual(LocalDate.parse("1970-01-01"))))
                if(!((billpayment.getDate().isAfter(startDate) && billpayment.getDate().isBefore(endtDate))
                        || billpayment.getDate().isEqual(startDate) || billpayment.getDate().isEqual(endtDate)))
                    return false;

            if(code!=null)
                if(!billpayment.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(billpaymenttypeId!=null)
                if(!billpayment.getBillpaymenttype().getId().equals(billpaymenttypeId)) return false;
            if(branchId!=null)
                if(!billpayment.getBranch().getId().equals(branchId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredBillpayments, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Billpayment> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all billpayments' basic data", UsecaseList.SHOW_ALL_BILLPAYMENTS);
        return billpaymentDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Billpayment get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get billpayment", UsecaseList.SHOW_BILLPAYMENT_DETAILS);
        Optional<Billpayment> optionalBillpayment = billpaymentDao.findById(id);
        if(optionalBillpayment.isEmpty()) throw new ObjectNotFoundException("Billpayment not found");
        return optionalBillpayment.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete billpayments", UsecaseList.DELETE_BILLPAYMENT);

        try{
            if(billpaymentDao.existsById(id)) billpaymentDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this billpayment already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Billpayment billpayment, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new billpayment", UsecaseList.ADD_BILLPAYMENT);

        billpayment.setTocreation(LocalDateTime.now());
        billpayment.setCreator(authUser);
        billpayment.setId(null);


        EntityValidator.validate(billpayment);

        PersistHelper.save(()->{
            billpayment.setCode(codeGenerator.getNextId(codeConfig));
            return billpaymentDao.save(billpayment);
        });

        return new ResourceLink(billpayment.getId(), "/billpayments/"+billpayment.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Billpayment billpayment, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update billpayment details", UsecaseList.UPDATE_BILLPAYMENT);

        Optional<Billpayment> optionalBillpayment = billpaymentDao.findById(id);
        if(optionalBillpayment.isEmpty()) throw new ObjectNotFoundException("Billpayment not found");
        Billpayment oldBillpayment = optionalBillpayment.get();

        billpayment.setId(id);
        billpayment.setCode(oldBillpayment.getCode());
        billpayment.setCreator(oldBillpayment.getCreator());
        billpayment.setTocreation(oldBillpayment.getTocreation());


        EntityValidator.validate(billpayment);

        billpayment = billpaymentDao.save(billpayment);
        return new ResourceLink(billpayment.getId(), "/billpayments/"+billpayment.getId());
    }

    @GetMapping("/sumof30")
    public Integer getSumof30(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all billpayments' basic data", UsecaseList.SHOW_ALL_BILLPAYMENTS);
        LocalDate today = LocalDate.now();
        LocalDate today30 = today.minusMonths(5);

        return billpaymentDao.getSumof30(today,today30);
    }

}
