package bit.project.server.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.*;
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
import bit.project.server.dao.ConsumeitempaymentDao;
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
@RequestMapping("/consumeitempayments")
public class ConsumeitempaymentController{

    @Autowired
    private ConsumeitempaymentDao consumeitempaymentDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ConsumeitempaymentController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("consumeitempayment");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("CIPP");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Consumeitempayment> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all consumeitempayments", UsecaseList.SHOW_ALL_CONSUMEITEMPAYMENTS);

        if(pageQuery.isEmptySearch()){
            return consumeitempaymentDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        Integer consumeitempurchaseId = pageQuery.getSearchParamAsInteger("consumeitempurchase");
        Integer paymentstatusId = pageQuery.getSearchParamAsInteger("paymentstatus");
        Integer paymenttypeId = pageQuery.getSearchParamAsInteger("paymenttype");

        LocalDate startDate = LocalDate.parse(pageQuery.getSearchParam("startDate"));
        LocalDate endtDate = LocalDate.parse(pageQuery.getSearchParam("endtDate"));

        List<Consumeitempayment> consumeitempayments = consumeitempaymentDao.findAll(DEFAULT_SORT);
        Stream<Consumeitempayment> stream = consumeitempayments.parallelStream();

        List<Consumeitempayment> filteredConsumeitempayments = stream.filter(consumeitempayment -> {

            if (!(startDate.isEqual(LocalDate.parse("1970-01-01")) && endtDate.isEqual(LocalDate.parse("1970-01-01"))))
                if(!((consumeitempayment.getDate().isAfter(startDate) && consumeitempayment.getDate().isBefore(endtDate))
                        || consumeitempayment.getDate().isEqual(startDate) || consumeitempayment.getDate().isEqual(endtDate)))
                    return false;


            if(consumeitempurchaseId!=null)
                if(!consumeitempayment.getConsumeitempurchase().getId().equals(consumeitempurchaseId)) return false;
            if(paymentstatusId!=null)
                if(!consumeitempayment.getPaymentstatus().getId().equals(paymentstatusId)) return false;
            if(paymenttypeId!=null)
                if(!consumeitempayment.getPaymenttype().getId().equals(paymenttypeId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredConsumeitempayments, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Consumeitempayment> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all consumeitempayments' basic data", UsecaseList.SHOW_ALL_CONSUMEITEMPAYMENTS);
        return consumeitempaymentDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Consumeitempayment get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get consumeitempayment", UsecaseList.SHOW_CONSUMEITEMPAYMENT_DETAILS);
        Optional<Consumeitempayment> optionalConsumeitempayment = consumeitempaymentDao.findById(id);
        if(optionalConsumeitempayment.isEmpty()) throw new ObjectNotFoundException("Consumeitempayment not found");
        return optionalConsumeitempayment.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete consumeitempayments", UsecaseList.DELETE_CONSUMEITEMPAYMENT);

        try{
            if(consumeitempaymentDao.existsById(id)) consumeitempaymentDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this consumeitempayment already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Consumeitempayment consumeitempayment, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new consumeitempayment", UsecaseList.ADD_CONSUMEITEMPAYMENT);

        consumeitempayment.setTocreation(LocalDateTime.now());
        consumeitempayment.setCreator(authUser);
        consumeitempayment.setId(null);
        consumeitempayment.setDate(LocalDate.now());
        consumeitempayment.setPaymentstatus(new Paymentstatus(1));;
        if (consumeitempayment.getPaymenttype().getId().equals(2)){
            consumeitempayment.setPaymentstatus(new Paymentstatus(2));;
        }

        EntityValidator.validate(consumeitempayment);

        PersistHelper.save(()->{
            consumeitempayment.setCode(codeGenerator.getNextId(codeConfig));
            return consumeitempaymentDao.save(consumeitempayment);
        });

        return new ResourceLink(consumeitempayment.getId(), "/consumeitempayments/"+consumeitempayment.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Consumeitempayment consumeitempayment, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update consumeitempayment details", UsecaseList.UPDATE_CONSUMEITEMPAYMENT);

        Optional<Consumeitempayment> optionalConsumeitempayment = consumeitempaymentDao.findById(id);
        if(optionalConsumeitempayment.isEmpty()) throw new ObjectNotFoundException("Consumeitempayment not found");
        Consumeitempayment oldConsumeitempayment = optionalConsumeitempayment.get();

        consumeitempayment.setId(id);
        consumeitempayment.setCode(oldConsumeitempayment.getCode());
        consumeitempayment.setCreator(oldConsumeitempayment.getCreator());
        consumeitempayment.setTocreation(oldConsumeitempayment.getTocreation());

        if (consumeitempayment.getPaymenttype().getId().equals(1)){
            consumeitempayment.setPaymentstatus(new Paymentstatus(1));
        }
        if (consumeitempayment.getPaymenttype().getId().equals(2) && oldConsumeitempayment.getPaymenttype().getId().equals(1)){
            consumeitempayment.setPaymentstatus(new Paymentstatus(2));
        }


        EntityValidator.validate(consumeitempayment);

        consumeitempayment = consumeitempaymentDao.save(consumeitempayment);
        return new ResourceLink(consumeitempayment.getId(), "/consumeitempayments/"+consumeitempayment.getId());
    }

    @GetMapping("/paymentbypurchase/{id}")
    public List<Consumeitempayment> getAllPaymentByPurchase(@PathVariable Integer id, PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all consumeitempayment' basic data", UsecaseList.SHOW_ALL_PROCUREMENTITEMS, UsecaseList.ADD_AUCTION, UsecaseList.UPDATE_AUCTION, UsecaseList.ADD_PROCUREMENTREFUND, UsecaseList.UPDATE_PROCUREMENTREFUND);
        List<Consumeitempayment> consumeitempayments =  consumeitempaymentDao.findAll(DEFAULT_SORT);
        ArrayList<Consumeitempayment> filteredConsumeitempayments = new ArrayList<>();
        consumeitempayments.forEach(consumeitempayment -> {
            if (consumeitempayment.getConsumeitempurchase().getId().equals(id)){
                filteredConsumeitempayments.add(consumeitempayment);
            }
        });
        return filteredConsumeitempayments;
    }


    @GetMapping("/sumof30")
    public Integer getSumof30(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all billpayments' basic data", UsecaseList.SHOW_ALL_CONSUMEITEMPAYMENTS);
        LocalDate today = LocalDate.now();
        LocalDate today30 = today.minusMonths(5);

        return consumeitempaymentDao.getSumof30(today,today30);
    }

}
