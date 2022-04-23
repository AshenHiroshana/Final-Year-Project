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
import bit.project.server.entity.Rentalpayment;
import bit.project.server.dao.RentalpaymentDao;
import bit.project.server.entity.Paymentstatus;
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
@RequestMapping("/rentalpayments")
public class RentalpaymentController{

    @Autowired
    private RentalpaymentDao rentalpaymentDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public RentalpaymentController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("rentalpayment");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("RP");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Rentalpayment> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all rentalpayments", UsecaseList.SHOW_ALL_RENTALPAYMENTS);

        if(pageQuery.isEmptySearch()){
            return rentalpaymentDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer rentalId = pageQuery.getSearchParamAsInteger("rental");
        Integer paymentstatusId = pageQuery.getSearchParamAsInteger("paymentstatus");
        Integer paymenttypeId = pageQuery.getSearchParamAsInteger("paymenttype");

        LocalDate startDate = LocalDate.parse(pageQuery.getSearchParam("startDate"));
        LocalDate endtDate = LocalDate.parse(pageQuery.getSearchParam("endtDate"));

        List<Rentalpayment> rentalpayments = rentalpaymentDao.findAll(DEFAULT_SORT);
        Stream<Rentalpayment> stream = rentalpayments.parallelStream();

        List<Rentalpayment> filteredRentalpayments = stream.filter(rentalpayment -> {

            if (!(startDate.isEqual(LocalDate.parse("1970-01-01")) && endtDate.isEqual(LocalDate.parse("1970-01-01"))))
                if(!((rentalpayment.getDate().isAfter(startDate) && rentalpayment.getDate().isBefore(endtDate))
                        || rentalpayment.getDate().isEqual(startDate) || rentalpayment.getDate().isEqual(endtDate)))
                    return false;

            if(code!=null)
                if(!rentalpayment.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(rentalId!=null)
                if(!rentalpayment.getRental().getId().equals(rentalId)) return false;
            if(paymentstatusId!=null)
                if(!rentalpayment.getPaymentstatus().getId().equals(paymentstatusId)) return false;
            if(paymenttypeId!=null)
                if(!rentalpayment.getPaymenttype().getId().equals(paymenttypeId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredRentalpayments, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Rentalpayment> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all rentalpayments' basic data", UsecaseList.SHOW_ALL_RENTALPAYMENTS);
        return rentalpaymentDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Rentalpayment get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get rentalpayment", UsecaseList.SHOW_RENTALPAYMENT_DETAILS);
        Optional<Rentalpayment> optionalRentalpayment = rentalpaymentDao.findById(id);
        if(optionalRentalpayment.isEmpty()) throw new ObjectNotFoundException("Rentalpayment not found");
        return optionalRentalpayment.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete rentalpayments", UsecaseList.DELETE_RENTALPAYMENT);

        try{
            if(rentalpaymentDao.existsById(id)) rentalpaymentDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this rentalpayment already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Rentalpayment rentalpayment, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new rentalpayment", UsecaseList.ADD_RENTALPAYMENT);

        rentalpayment.setTocreation(LocalDateTime.now());
        rentalpayment.setCreator(authUser);
        rentalpayment.setId(null);
        rentalpayment.setPaymentstatus(new Paymentstatus(1));;
        if (rentalpayment.getPaymenttype().getId().equals(2)){
            rentalpayment.setPaymentstatus(new Paymentstatus(2));;
        }

        EntityValidator.validate(rentalpayment);

        PersistHelper.save(()->{
            rentalpayment.setCode(codeGenerator.getNextId(codeConfig));
            return rentalpaymentDao.save(rentalpayment);
        });

        return new ResourceLink(rentalpayment.getId(), "/rentalpayments/"+rentalpayment.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Rentalpayment rentalpayment, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update rentalpayment details", UsecaseList.UPDATE_RENTALPAYMENT);

        Optional<Rentalpayment> optionalRentalpayment = rentalpaymentDao.findById(id);
        if(optionalRentalpayment.isEmpty()) throw new ObjectNotFoundException("Rentalpayment not found");
        Rentalpayment oldRentalpayment = optionalRentalpayment.get();

        rentalpayment.setId(id);
        rentalpayment.setCode(oldRentalpayment.getCode());
        rentalpayment.setCreator(oldRentalpayment.getCreator());
        rentalpayment.setTocreation(oldRentalpayment.getTocreation());


        EntityValidator.validate(rentalpayment);

        rentalpayment = rentalpaymentDao.save(rentalpayment);
        return new ResourceLink(rentalpayment.getId(), "/rentalpayments/"+rentalpayment.getId());
    }


    @GetMapping("/sumof30")
    public Integer getSumof30(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all billpayments' basic data", UsecaseList.SHOW_ALL_BILLPAYMENTS);
        LocalDate today = LocalDate.now();
        LocalDate today30 = today.minusMonths(5);

        return rentalpaymentDao.getSumof30(today,today30);
    }
}
