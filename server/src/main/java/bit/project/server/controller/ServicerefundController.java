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
import bit.project.server.entity.Servicerefund;
import bit.project.server.dao.ServicerefundDao;
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
@RequestMapping("/servicerefunds")
public class ServicerefundController{

    @Autowired
    private ServicerefundDao servicerefundDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ServicerefundController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("servicerefund");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("SVSR");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Servicerefund> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all servicerefunds", UsecaseList.SHOW_ALL_SERVICEREFUNDS);

        if(pageQuery.isEmptySearch()){
            return servicerefundDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer serviceId = pageQuery.getSearchParamAsInteger("service");
        Integer paymentstatusId = pageQuery.getSearchParamAsInteger("paymentstatus");
        Integer paymenttypeId = pageQuery.getSearchParamAsInteger("paymenttype");

        List<Servicerefund> servicerefunds = servicerefundDao.findAll(DEFAULT_SORT);
        Stream<Servicerefund> stream = servicerefunds.parallelStream();

        List<Servicerefund> filteredServicerefunds = stream.filter(servicerefund -> {
            if(code!=null)
                if(!servicerefund.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(serviceId!=null)
                if(!servicerefund.getService().getId().equals(serviceId)) return false;
            if(paymentstatusId!=null)
                if(!servicerefund.getPaymentstatus().getId().equals(paymentstatusId)) return false;
            if(paymenttypeId!=null)
                if(!servicerefund.getPaymenttype().getId().equals(paymenttypeId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredServicerefunds, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Servicerefund> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all servicerefunds' basic data", UsecaseList.SHOW_ALL_SERVICEREFUNDS);
        return servicerefundDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Servicerefund get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get servicerefund", UsecaseList.SHOW_SERVICEREFUND_DETAILS);
        Optional<Servicerefund> optionalServicerefund = servicerefundDao.findById(id);
        if(optionalServicerefund.isEmpty()) throw new ObjectNotFoundException("Servicerefund not found");
        return optionalServicerefund.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete servicerefunds", UsecaseList.DELETE_SERVICEREFUND);

        try{
            if(servicerefundDao.existsById(id)) servicerefundDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this servicerefund already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Servicerefund servicerefund, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new servicerefund", UsecaseList.ADD_SERVICEREFUND);

        servicerefund.setTocreation(LocalDateTime.now());
        servicerefund.setCreator(authUser);
        servicerefund.setId(null);
        servicerefund.setPaymentstatus(new Paymentstatus(1));;
        if (servicerefund.getPaymenttype().getId().equals(2)){
            servicerefund.setPaymentstatus(new Paymentstatus(2));;
        }


        EntityValidator.validate(servicerefund);

        PersistHelper.save(()->{
            servicerefund.setCode(codeGenerator.getNextId(codeConfig));
            return servicerefundDao.save(servicerefund);
        });

        return new ResourceLink(servicerefund.getId(), "/servicerefunds/"+servicerefund.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Servicerefund servicerefund, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update servicerefund details", UsecaseList.UPDATE_SERVICEREFUND);

        Optional<Servicerefund> optionalServicerefund = servicerefundDao.findById(id);
        if(optionalServicerefund.isEmpty()) throw new ObjectNotFoundException("Servicerefund not found");
        Servicerefund oldServicerefund = optionalServicerefund.get();

        servicerefund.setId(id);
        servicerefund.setCode(oldServicerefund.getCode());
        servicerefund.setCreator(oldServicerefund.getCreator());
        servicerefund.setTocreation(oldServicerefund.getTocreation());


        EntityValidator.validate(servicerefund);

        servicerefund = servicerefundDao.save(servicerefund);
        return new ResourceLink(servicerefund.getId(), "/servicerefunds/"+servicerefund.getId());
    }

}
