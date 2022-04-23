package bit.project.server.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.dao.EmployeeDao;
import bit.project.server.dao.NotificationDao;
import bit.project.server.dao.UserDao;
import bit.project.server.entity.*;
import bit.project.server.dao.PayrollDao;
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
@RequestMapping("/payrolls")
public class PayrollController{

    @Autowired
    private PayrollDao payrollDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private EmployeeDao employeeDao;

    @Autowired
    private NotificationDao notificationDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public PayrollController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("payroll");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("PR");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Payroll> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all payrolls", UsecaseList.SHOW_ALL_PAYROLLS);

        if(pageQuery.isEmptySearch()){
            return payrollDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer employeeId = pageQuery.getSearchParamAsInteger("employee");
        Integer appointmentId = pageQuery.getSearchParamAsInteger("appointment");
        LocalDate startDate = LocalDate.parse(pageQuery.getSearchParam("startDate"));
        LocalDate endtDate = LocalDate.parse(pageQuery.getSearchParam("endtDate"));

        List<Payroll> payrolls = payrollDao.findAll(DEFAULT_SORT);
        Stream<Payroll> stream = payrolls.parallelStream();

        List<Payroll> filteredPayrolls = stream.filter(payroll -> {

            if (!(startDate.isEqual(LocalDate.parse("1970-01-01")) && endtDate.isEqual(LocalDate.parse("1970-01-01"))))
                if(!((payroll.getPaydate().isAfter(startDate) && payroll.getPaydate().isBefore(endtDate))
                        || payroll.getPaydate().isEqual(startDate) || payroll.getPaydate().isEqual(endtDate)))
                    return false;

            if(code!=null)
                if(!payroll.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(employeeId!=null)
                if(!payroll.getEmployee().getId().equals(employeeId)) return false;
            if(appointmentId!=null)
                if(!payroll.getAppointment().getId().equals(appointmentId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredPayrolls, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Payroll> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all payrolls' basic data", UsecaseList.SHOW_ALL_PAYROLLS);
        return payrollDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Payroll get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get payroll", UsecaseList.SHOW_PAYROLL_DETAILS);
        Optional<Payroll> optionalPayroll = payrollDao.findById(id);
        if(optionalPayroll.isEmpty()) throw new ObjectNotFoundException("Payroll not found");
        return optionalPayroll.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete payrolls", UsecaseList.DELETE_PAYROLL);

        try{
            if(payrollDao.existsById(id)) payrollDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this payroll already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Payroll payroll, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new payroll", UsecaseList.ADD_PAYROLL);

        payroll.setTocreation(LocalDateTime.now());
        payroll.setCreator(authUser);
        payroll.setId(null);
        payroll.setPaydate(LocalDate.now());

        if (payroll.getPayrolladditionList() != null){
            for(Payrolladdition payrolladdition : payroll.getPayrolladditionList()) payrolladdition.setPayroll(payroll);
        }
        if (payroll.getPayrolldeductionList() != null){
            for(Payrolldeduction payrolldeduction : payroll.getPayrolldeductionList()) payrolldeduction.setPayroll(payroll);
        }

        EntityValidator.validate(payroll);

        PersistHelper.save(()->{
            payroll.setCode(codeGenerator.getNextId(codeConfig));
            return payrollDao.save(payroll);
        });

        try {
            Notification notification = new Notification();
            notification.setId(UUID.randomUUID().toString());
            notification.setUser(userDao.findByEmployee(payroll.getEmployee()));
            notification.setDosend(LocalDateTime.now());
            notification.setMessage(LocalDateTime.now().getMonth() + " Salary is Paid ");
            notificationDao.save(notification);
        }catch (Exception e){

        }



        return new ResourceLink(payroll.getId(), "/payrolls/"+payroll.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Payroll payroll, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update payroll details", UsecaseList.UPDATE_PAYROLL);

        Optional<Payroll> optionalPayroll = payrollDao.findById(id);
        if(optionalPayroll.isEmpty()) throw new ObjectNotFoundException("Payroll not found");
        Payroll oldPayroll = optionalPayroll.get();

        payroll.setId(id);
        payroll.setCode(oldPayroll.getCode());
        payroll.setCreator(oldPayroll.getCreator());
        payroll.setTocreation(oldPayroll.getTocreation());

        for(Payrolladdition payrolladdition : payroll.getPayrolladditionList()) payrolladdition.setPayroll(payroll);
        for(Payrolldeduction payrolldeduction : payroll.getPayrolldeductionList()) payrolldeduction.setPayroll(payroll);

        EntityValidator.validate(payroll);

        payroll = payrollDao.save(payroll);
        return new ResourceLink(payroll.getId(), "/payrolls/"+payroll.getId());
    }


    @GetMapping("/byemployee/{id}")
    public List<Payroll> getAllByEmployee(@PathVariable Integer id, PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all payrolls' basic data", UsecaseList.SHOW_ALL_PAYROLLS);

        LocalDate startDate = LocalDate.parse(pageQuery.getSearchParam("startDate"));
        LocalDate endtDate = LocalDate.parse(pageQuery.getSearchParam("endtDate"));

        Optional<Employee> optionalEmployee = employeeDao.findById(id);
        List<Payroll> payrolls = payrollDao.findAllByEmployee(optionalEmployee.get());

        Stream<Payroll> stream = payrolls.parallelStream();

        List<Payroll> filteredPayrolls = stream.filter(payroll -> {

            if (!(startDate.isEqual(LocalDate.parse("1970-01-01")) && endtDate.isEqual(LocalDate.parse("1970-01-01"))))
                if(!((payroll.getPaydate().isAfter(startDate) && payroll.getPaydate().isBefore(endtDate))
                        || payroll.getPaydate().isEqual(startDate) || payroll.getPaydate().isEqual(endtDate)))
                    return false;
            return true;
        }).collect(Collectors.toList());

        return filteredPayrolls;
    }


}
