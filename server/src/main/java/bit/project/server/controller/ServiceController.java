package bit.project.server.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.dao.ServicerefundDao;
import bit.project.server.entity.*;
import bit.project.server.dao.ServiceDao;
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
@RequestMapping("/services")
public class ServiceController{

    @Autowired
    private ServiceDao serviceDao;

    @Autowired
    private ServicerefundDao servicerefundDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ServiceController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("service");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("SVS");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Service> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all services", UsecaseList.SHOW_ALL_SERVICES);

        if(pageQuery.isEmptySearch()){
            return serviceDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        Integer branchId = pageQuery.getSearchParamAsInteger("branch");
        Integer vendorId = pageQuery.getSearchParamAsInteger("vendor");
        Integer servicetypeId = pageQuery.getSearchParamAsInteger("servicetype");
        Integer servicestatusId = pageQuery.getSearchParamAsInteger("servicestatus");

        LocalDate startDate = LocalDate.parse(pageQuery.getSearchParam("startDate"));
        LocalDate endtDate = LocalDate.parse(pageQuery.getSearchParam("endtDate"));


        List<Service> services = serviceDao.findAll(DEFAULT_SORT);
        Stream<Service> stream = services.parallelStream();

        List<Service> filteredServices = stream.filter(service -> {

            if (!(startDate.isEqual(LocalDate.parse("1970-01-01")) && endtDate.isEqual(LocalDate.parse("1970-01-01"))))
                if(!((service.getSdate().isAfter(startDate) && service.getSdate().isBefore(endtDate))
                        || service.getSdate().isEqual(startDate) || service.getSdate().isEqual(endtDate)))
                    return false;

            if(branchId!=null)
                if(!service.getBranch().getId().equals(branchId)) return false;
            if(vendorId!=null)
                if(!service.getVendor().getId().equals(vendorId)) return false;
            if(servicetypeId!=null)
                if(!service.getServicetype().getId().equals(servicetypeId)) return false;
            if(servicestatusId!=null)
                if(!service.getServicestatus().getId().equals(servicestatusId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredServices, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Service> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all services' basic data", UsecaseList.SHOW_ALL_SERVICES, UsecaseList.ADD_SERVICEPAYMENT, UsecaseList.UPDATE_SERVICEPAYMENT, UsecaseList.ADD_SERVICEREFUND, UsecaseList.UPDATE_SERVICEREFUND);
        return serviceDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Service get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get service", UsecaseList.SHOW_SERVICE_DETAILS);
        Optional<Service> optionalService = serviceDao.findById(id);
        if(optionalService.isEmpty()) throw new ObjectNotFoundException("Service not found");
        return optionalService.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete services", UsecaseList.DELETE_SERVICE);

        try{
            if(serviceDao.existsById(id)) serviceDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this service already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Service service, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new service", UsecaseList.ADD_SERVICE);

        service.setTocreation(LocalDateTime.now());
        service.setCreator(authUser);
        service.setId(null);
        service.setServicestatus(new Servicestatus(1));;

        for(Serviceprocurementitem serviceprocurementitem : service.getServiceprocurementitemList()) serviceprocurementitem.setService(service);

        EntityValidator.validate(service);

        PersistHelper.save(()->{
            service.setCode(codeGenerator.getNextId(codeConfig));
            return serviceDao.save(service);
        });

        return new ResourceLink(service.getId(), "/services/"+service.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Service service, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update service details", UsecaseList.UPDATE_SERVICE);

        Optional<Service> optionalService = serviceDao.findById(id);
        if(optionalService.isEmpty()) throw new ObjectNotFoundException("Service not found");
        Service oldService = optionalService.get();

        service.setId(id);
        service.setCode(oldService.getCode());
        service.setCreator(oldService.getCreator());
        service.setTocreation(oldService.getTocreation());

        for(Serviceprocurementitem serviceprocurementitem : service.getServiceprocurementitemList()) serviceprocurementitem.setService(service);

        EntityValidator.validate(service);

        service = serviceDao.save(service);
        return new ResourceLink(service.getId(), "/services/"+service.getId());
    }

    @GetMapping("/nonepayed")
    public List<Service> getAllNonePayed(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all services' basic data", UsecaseList.SHOW_ALL_SERVICES, UsecaseList.ADD_SERVICEPAYMENT, UsecaseList.UPDATE_SERVICEPAYMENT, UsecaseList.ADD_SERVICEREFUND, UsecaseList.UPDATE_SERVICEREFUND);
        return serviceDao.findAllNonePayed();
    }

    @GetMapping("/nonerefunded")
    public List<Service> getAllNoneRefunded(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all services' basic data", UsecaseList.SHOW_ALL_SERVICES, UsecaseList.ADD_SERVICEPAYMENT, UsecaseList.UPDATE_SERVICEPAYMENT, UsecaseList.ADD_SERVICEREFUND, UsecaseList.UPDATE_SERVICEREFUND);

        List<Service> services = serviceDao.findAll(DEFAULT_SORT);
        List<Servicerefund> servicerefunds = servicerefundDao.findAll(DEFAULT_SORT);

        if (servicerefunds.size() != 0){
            ArrayList<Service> filteredProcurementpurchases = new ArrayList<>();

            services.forEach(service -> {
                servicerefunds.forEach(servicerefund -> {
                    if (!servicerefund.getService().getId().equals(service.getId())){
                        filteredProcurementpurchases.add(service);
                    }
                });
            });
            return filteredProcurementpurchases;
        }else {
            return services;
        }

    }

    @GetMapping("/inprogress")
    public List<Service> getAllInProgress(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all services' basic data", UsecaseList.SHOW_ALL_SERVICES, UsecaseList.ADD_SERVICEPAYMENT, UsecaseList.UPDATE_SERVICEPAYMENT, UsecaseList.ADD_SERVICEREFUND, UsecaseList.UPDATE_SERVICEREFUND);
        return serviceDao.findAllInProgress();
    }
}
