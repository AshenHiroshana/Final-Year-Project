package bit.project.server.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.dao.RentalpaymentDao;
import bit.project.server.entity.Rentalpayment;
import bit.project.server.entity.User;
import bit.project.server.entity.Rental;
import bit.project.server.dao.RentalDao;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.entity.Rentalstatus;
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
@RequestMapping("/rentals")
public class RentalController{

    @Autowired
    private RentalDao rentalDao;

    @Autowired
    private RentalpaymentDao rentalpaymentDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public RentalController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("rental");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("RE");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Rental> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all rentals", UsecaseList.SHOW_ALL_RENTALS);

        if(pageQuery.isEmptySearch()){
            return rentalDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer branchId = pageQuery.getSearchParamAsInteger("branch");
        Integer rentalstatusId = pageQuery.getSearchParamAsInteger("rentalstatus");

        List<Rental> rentals = rentalDao.findAll(DEFAULT_SORT);
        Stream<Rental> stream = rentals.parallelStream();

        List<Rental> filteredRentals = stream.filter(rental -> {
            if(code!=null)
                if(!rental.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(branchId!=null)
                if(!rental.getBranch().getId().equals(branchId)) return false;
            if(rentalstatusId!=null)
                if(!rental.getRentalstatus().getId().equals(rentalstatusId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredRentals, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Rental> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all rentals' basic data", UsecaseList.SHOW_ALL_RENTALS, UsecaseList.ADD_RENTALPAYMENT, UsecaseList.UPDATE_RENTALPAYMENT);
        return rentalDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Rental get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get rental", UsecaseList.SHOW_RENTAL_DETAILS);
        Optional<Rental> optionalRental = rentalDao.findById(id);
        if(optionalRental.isEmpty()) throw new ObjectNotFoundException("Rental not found");
        return optionalRental.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete rentals", UsecaseList.DELETE_RENTAL);

        try{
            if(rentalDao.existsById(id)) rentalDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this rental already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Rental rental, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new rental", UsecaseList.ADD_RENTAL);

        rental.setTocreation(LocalDateTime.now());
        rental.setCreator(authUser);
        rental.setId(null);
        rental.setRentalstatus(new Rentalstatus(1));;


        EntityValidator.validate(rental);

        PersistHelper.save(()->{
            rental.setCode(codeGenerator.getNextId(codeConfig));
            return rentalDao.save(rental);
        });

        return new ResourceLink(rental.getId(), "/rentals/"+rental.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Rental rental, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update rental details", UsecaseList.UPDATE_RENTAL);

        Optional<Rental> optionalRental = rentalDao.findById(id);
        if(optionalRental.isEmpty()) throw new ObjectNotFoundException("Rental not found");
        Rental oldRental = optionalRental.get();

        rental.setId(id);
        rental.setCode(oldRental.getCode());
        rental.setCreator(oldRental.getCreator());
        rental.setTocreation(oldRental.getTocreation());


        EntityValidator.validate(rental);

        rental = rentalDao.save(rental);
        return new ResourceLink(rental.getId(), "/rentals/"+rental.getId());
    }

    @GetMapping("/forpay/{month}")
    public List<Rental> getAllForPay(@PathVariable Integer month,PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all rentals' basic data", UsecaseList.SHOW_ALL_RENTALS, UsecaseList.ADD_RENTALPAYMENT, UsecaseList.UPDATE_RENTALPAYMENT);
        List<Rental> rentalList = rentalDao.findAll();
        List<Rentalpayment> rentalpaymentList = rentalpaymentDao.findAll();
        ArrayList<Rental> rentals = new ArrayList<>();

        if (rentalpaymentList != null){
            rentalpaymentList.forEach(rentalpayment -> {
                if (rentalpayment.getDate().getMonthValue() == month){
                    rentals.add(rentalpayment.getRental());
                }
            });
        }

        rentalList.removeAll(rentals);

        return rentalList;
    }

}
