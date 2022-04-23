package bit.project.server.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.Procurementpayment;
import bit.project.server.entity.User;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.entity.Paymentstatus;
import bit.project.server.entity.Servicepayment;
import bit.project.server.dao.ServicepaymentDao;
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
@RequestMapping("/servicepayments")
public class ServicepaymentController{

    @Autowired
    private ServicepaymentDao servicepaymentDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ServicepaymentController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("servicepayment");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("SVSP");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Servicepayment> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all servicepayments", UsecaseList.SHOW_ALL_SERVICEPAYMENTS);

        if(pageQuery.isEmptySearch()){
            return servicepaymentDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer serviceId = pageQuery.getSearchParamAsInteger("service");
        Integer paymentstatusId = pageQuery.getSearchParamAsInteger("paymentstatus");
        Integer paymenttypeId = pageQuery.getSearchParamAsInteger("paymenttype");

        LocalDate startDate = LocalDate.parse(pageQuery.getSearchParam("startDate"));
        LocalDate endtDate = LocalDate.parse(pageQuery.getSearchParam("endtDate"));

        List<Servicepayment> servicepayments = servicepaymentDao.findAll(DEFAULT_SORT);
        Stream<Servicepayment> stream = servicepayments.parallelStream();

        List<Servicepayment> filteredServicepayments = stream.filter(servicepayment -> {

            if (!(startDate.isEqual(LocalDate.parse("1970-01-01")) && endtDate.isEqual(LocalDate.parse("1970-01-01"))))
                if(!((servicepayment.getDate().isAfter(startDate) && servicepayment.getDate().isBefore(endtDate))
                        || servicepayment.getDate().isEqual(startDate) || servicepayment.getDate().isEqual(endtDate)))
                    return false;

            if(code!=null)
                if(!servicepayment.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(serviceId!=null)
                if(!servicepayment.getService().getId().equals(serviceId)) return false;
            if(paymentstatusId!=null)
                if(!servicepayment.getPaymentstatus().getId().equals(paymentstatusId)) return false;
            if(paymenttypeId!=null)
                if(!servicepayment.getPaymenttype().getId().equals(paymenttypeId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredServicepayments, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Servicepayment> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all servicepayments' basic data", UsecaseList.SHOW_ALL_SERVICEPAYMENTS);
        return servicepaymentDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Servicepayment get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get servicepayment", UsecaseList.SHOW_SERVICEPAYMENT_DETAILS);
        Optional<Servicepayment> optionalServicepayment = servicepaymentDao.findById(id);
        if(optionalServicepayment.isEmpty()) throw new ObjectNotFoundException("Servicepayment not found");
        return optionalServicepayment.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete servicepayments", UsecaseList.DELETE_SERVICEPAYMENT);

        try{
            if(servicepaymentDao.existsById(id)) servicepaymentDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this servicepayment already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Servicepayment servicepayment, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new servicepayment", UsecaseList.ADD_SERVICEPAYMENT);

        servicepayment.setTocreation(LocalDateTime.now());
        servicepayment.setCreator(authUser);
        servicepayment.setId(null);
        servicepayment.setDate(LocalDate.now());
        servicepayment.setPaymentstatus(new Paymentstatus(1));;
        if (servicepayment.getPaymenttype().getId().equals(2)){
            servicepayment.setPaymentstatus(new Paymentstatus(2));;
        }


        servicepayment.setDate(LocalDate.now());

        EntityValidator.validate(servicepayment);

        PersistHelper.save(()->{
            servicepayment.setCode(codeGenerator.getNextId(codeConfig));
            return servicepaymentDao.save(servicepayment);
        });

        return new ResourceLink(servicepayment.getId(), "/servicepayments/"+servicepayment.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Servicepayment servicepayment, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update servicepayment details", UsecaseList.UPDATE_SERVICEPAYMENT);

        Optional<Servicepayment> optionalServicepayment = servicepaymentDao.findById(id);
        if(optionalServicepayment.isEmpty()) throw new ObjectNotFoundException("Servicepayment not found");
        Servicepayment oldServicepayment = optionalServicepayment.get();

        servicepayment.setId(id);
        servicepayment.setCode(oldServicepayment.getCode());
        servicepayment.setCreator(oldServicepayment.getCreator());
        servicepayment.setTocreation(oldServicepayment.getTocreation());


        EntityValidator.validate(servicepayment);

        servicepayment = servicepaymentDao.save(servicepayment);
        return new ResourceLink(servicepayment.getId(), "/servicepayments/"+servicepayment.getId());
    }

    @GetMapping("/paymentbypurchase/{id}")
    public List<Servicepayment> getAllPaymentByPurchase(@PathVariable Integer id, PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all procurementitems' basic data", UsecaseList.SHOW_ALL_PROCUREMENTITEMS, UsecaseList.ADD_AUCTION, UsecaseList.UPDATE_AUCTION, UsecaseList.ADD_PROCUREMENTREFUND, UsecaseList.UPDATE_PROCUREMENTREFUND);
        List<Servicepayment> servicepayments =  servicepaymentDao.findAll(DEFAULT_SORT);
        ArrayList<Servicepayment> filteredServicepayments = new ArrayList<>();
        servicepayments.forEach(servicepayment -> {
            if (servicepayment.getService().getId().equals(id)){
                filteredServicepayments.add(servicepayment);
            }
        });
        return filteredServicepayments;
    }


    @GetMapping("/sumof30")
    public Integer getSumof30(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all billpayments' basic data", UsecaseList.SHOW_ALL_RENTALPAYMENTS);
        LocalDate today = LocalDate.now();
        LocalDate today30 = today.minusMonths(5);

        return servicepaymentDao.getSumof30(today,today30);
    }

}
