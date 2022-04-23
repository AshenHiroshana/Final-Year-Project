package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import bit.project.server.entity.Vendor;
import bit.project.server.dao.VendorDao;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.entity.Vendorstatus;
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
@RequestMapping("/vendors")
public class VendorController{

    @Autowired
    private VendorDao vendorDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public VendorController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("vendor");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("VE");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Vendor> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all vendors", UsecaseList.SHOW_ALL_VENDORS);

        if(pageQuery.isEmptySearch()){
            return vendorDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        String name = pageQuery.getSearchParam("name");
        Integer vendortypeId = pageQuery.getSearchParamAsInteger("vendortype");
        Integer vendorstatusId = pageQuery.getSearchParamAsInteger("vendorstatus");

        List<Vendor> vendors = vendorDao.findAll(DEFAULT_SORT);
        Stream<Vendor> stream = vendors.parallelStream();

        List<Vendor> filteredVendors = stream.filter(vendor -> {
            if(code!=null)
                if(!vendor.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(name!=null)
                if(!vendor.getName().toLowerCase().contains(name.toLowerCase())) return false;
            if(vendortypeId!=null)
                if(!vendor.getVendortype().getId().equals(vendortypeId)) return false;
            if(vendorstatusId!=null)
                if(!vendor.getVendorstatus().getId().equals(vendorstatusId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredVendors, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Vendor> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all vendors' basic data", UsecaseList.SHOW_ALL_VENDORS, UsecaseList.ADD_CONSUMEITEM, UsecaseList.UPDATE_CONSUMEITEM, UsecaseList.ADD_CONSUMEITEMPURCHASE, UsecaseList.UPDATE_CONSUMEITEMPURCHASE, UsecaseList.ADD_PROCUREMENTITEM, UsecaseList.UPDATE_PROCUREMENTITEM, UsecaseList.ADD_PROCUREMENTITEMPURCHASE, UsecaseList.UPDATE_PROCUREMENTITEMPURCHASE, UsecaseList.ADD_PROCUREMENTITEMTYPE, UsecaseList.UPDATE_PROCUREMENTITEMTYPE, UsecaseList.ADD_SERVICE, UsecaseList.UPDATE_SERVICE, UsecaseList.ADD_SERVICETYPE, UsecaseList.UPDATE_SERVICETYPE);
        return vendorDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Vendor get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get vendor", UsecaseList.SHOW_VENDOR_DETAILS);
        Optional<Vendor> optionalVendor = vendorDao.findById(id);
        if(optionalVendor.isEmpty()) throw new ObjectNotFoundException("Vendor not found");
        return optionalVendor.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete vendors", UsecaseList.DELETE_VENDOR);

        try{
            if(vendorDao.existsById(id)) vendorDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this vendor already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Vendor vendor, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new vendor", UsecaseList.ADD_VENDOR);

        vendor.setTocreation(LocalDateTime.now());
        vendor.setCreator(authUser);
        vendor.setId(null);
        vendor.setVendorstatus(new Vendorstatus(1));;


        EntityValidator.validate(vendor);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(vendor.getEmail() != null){
            Vendor vendorByEmail = vendorDao.findByEmail(vendor.getEmail());
            if(vendorByEmail!=null) errorBag.add("email","email already exists");
        }

        if(vendor.getPrimarycontact() != null){
            Vendor vendorByPrimarycontact = vendorDao.findByPrimarycontact(vendor.getPrimarycontact());
            if(vendorByPrimarycontact!=null) errorBag.add("primarycontact","primarycontact already exists");
        }

        if(vendor.getFax() != null){
            Vendor vendorByFax = vendorDao.findByFax(vendor.getFax());
            if(vendorByFax!=null) errorBag.add("fax","fax already exists");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        PersistHelper.save(()->{
            vendor.setCode(codeGenerator.getNextId(codeConfig));
            return vendorDao.save(vendor);
        });

        return new ResourceLink(vendor.getId(), "/vendors/"+vendor.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Vendor vendor, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update vendor details", UsecaseList.UPDATE_VENDOR);

        Optional<Vendor> optionalVendor = vendorDao.findById(id);
        if(optionalVendor.isEmpty()) throw new ObjectNotFoundException("Vendor not found");
        Vendor oldVendor = optionalVendor.get();

        vendor.setId(id);
        vendor.setCode(oldVendor.getCode());
        vendor.setCreator(oldVendor.getCreator());
        vendor.setTocreation(oldVendor.getTocreation());


        EntityValidator.validate(vendor);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(vendor.getEmail() != null){
            Vendor vendorByEmail = vendorDao.findByEmail(vendor.getEmail());
            if(vendorByEmail!=null)
                if(!vendorByEmail.getId().equals(id))
                    errorBag.add("email","email already exists");
        }

        if(vendor.getPrimarycontact() != null){
            Vendor vendorByPrimarycontact = vendorDao.findByPrimarycontact(vendor.getPrimarycontact());
            if(vendorByPrimarycontact!=null)
                if(!vendorByPrimarycontact.getId().equals(id))
                    errorBag.add("primarycontact","primarycontact already exists");
        }

        if(vendor.getFax() != null){
            Vendor vendorByFax = vendorDao.findByFax(vendor.getFax());
            if(vendorByFax!=null)
                if(!vendorByFax.getId().equals(id))
                    errorBag.add("fax","fax already exists");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        vendor = vendorDao.save(vendor);
        return new ResourceLink(vendor.getId(), "/vendors/"+vendor.getId());
    }

}