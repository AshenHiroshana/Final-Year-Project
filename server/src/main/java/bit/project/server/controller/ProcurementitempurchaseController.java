package bit.project.server.controller;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.dao.ProcurementrefundDao;
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
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.dao.ProcurementitempurchaseDao;
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
@RequestMapping("/procurementitempurchases")
public class ProcurementitempurchaseController{

    @Autowired
    private ProcurementitempurchaseDao procurementitempurchaseDao;

    @Autowired
    private ProcurementrefundDao procurementrefundDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ProcurementitempurchaseController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("procurementitempurchase");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("PIP");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Procurementitempurchase> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all procurementitempurchases", UsecaseList.SHOW_ALL_PROCUREMENTITEMPURCHASES);

        if(pageQuery.isEmptySearch()){
            return procurementitempurchaseDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer vendorId = pageQuery.getSearchParamAsInteger("vendor");

        List<Procurementitempurchase> procurementitempurchases = procurementitempurchaseDao.findAll(DEFAULT_SORT);
        Stream<Procurementitempurchase> stream = procurementitempurchases.parallelStream();

        List<Procurementitempurchase> filteredProcurementitempurchases = stream.filter(procurementitempurchase -> {
            if(code!=null)
                if(!procurementitempurchase.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(vendorId!=null)
                if(!procurementitempurchase.getVendor().getId().equals(vendorId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredProcurementitempurchases, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Procurementitempurchase> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all procurementitempurchases' basic data", UsecaseList.SHOW_ALL_PROCUREMENTITEMPURCHASES, UsecaseList.ADD_PROCUREMENTITEM, UsecaseList.UPDATE_PROCUREMENTITEM, UsecaseList.ADD_PROCUREMENTPAYMENT, UsecaseList.UPDATE_PROCUREMENTPAYMENT, UsecaseList.ADD_PROCUREMENTREFUND, UsecaseList.UPDATE_PROCUREMENTREFUND);
        return procurementitempurchaseDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Procurementitempurchase get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get procurementitempurchase", UsecaseList.SHOW_PROCUREMENTITEMPURCHASE_DETAILS);
        Optional<Procurementitempurchase> optionalProcurementitempurchase = procurementitempurchaseDao.findById(id);
        if(optionalProcurementitempurchase.isEmpty()) throw new ObjectNotFoundException("Procurementitempurchase not found");
        return optionalProcurementitempurchase.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete procurementitempurchases", UsecaseList.DELETE_PROCUREMENTITEMPURCHASE);

        try{
            if(procurementitempurchaseDao.existsById(id)) procurementitempurchaseDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this procurementitempurchase already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Procurementitempurchase procurementitempurchase, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new procurementitempurchase", UsecaseList.ADD_PROCUREMENTITEMPURCHASE);

        procurementitempurchase.setTocreation(LocalDateTime.now());
        procurementitempurchase.setCreator(authUser);
        procurementitempurchase.setId(null);
        procurementitempurchase.setBalance(procurementitempurchase.getTotal());


        EntityValidator.validate(procurementitempurchase);

        PersistHelper.save(()->{
            procurementitempurchase.setCode(codeGenerator.getNextId(codeConfig));
            return procurementitempurchaseDao.save(procurementitempurchase);
        });

        return new ResourceLink(procurementitempurchase.getId(), "/procurementitempurchases/"+procurementitempurchase.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Procurementitempurchase procurementitempurchase, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update procurementitempurchase details", UsecaseList.UPDATE_PROCUREMENTITEMPURCHASE);

        Optional<Procurementitempurchase> optionalProcurementitempurchase = procurementitempurchaseDao.findById(id);
        if(optionalProcurementitempurchase.isEmpty()) throw new ObjectNotFoundException("Procurementitempurchase not found");
        Procurementitempurchase oldProcurementitempurchase = optionalProcurementitempurchase.get();

        procurementitempurchase.setId(id);
        procurementitempurchase.setCode(oldProcurementitempurchase.getCode());
        procurementitempurchase.setCreator(oldProcurementitempurchase.getCreator());
        procurementitempurchase.setTocreation(oldProcurementitempurchase.getTocreation());


        EntityValidator.validate(procurementitempurchase);

        procurementitempurchase = procurementitempurchaseDao.save(procurementitempurchase);
        return new ResourceLink(procurementitempurchase.getId(), "/procurementitempurchases/"+procurementitempurchase.getId());
    }

    @GetMapping("/byvendor/{id}")
    public List<Procurementitempurchase> getAllByVendor(@PathVariable Integer id, PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all procurementitemtypes' basic data", UsecaseList.SHOW_ALL_PROCUREMENTITEMTYPES, UsecaseList.ADD_PROCUREMENTITEM, UsecaseList.UPDATE_PROCUREMENTITEM);
        ArrayList<Procurementitempurchase> filteredProcurementitempurchase = new ArrayList<>();
        List<Procurementitempurchase> Procurementitempurchase = procurementitempurchaseDao.findAll();
        Procurementitempurchase.forEach(procurementitempurchase -> {
            if (procurementitempurchase.getVendor().getId().equals(id) /*&& procurementitempurchase.getBalance().compareTo(BigDecimal.ZERO) > 0*/){
                filteredProcurementitempurchase.add(procurementitempurchase);
            };
        });
        return filteredProcurementitempurchase;
    }

    @GetMapping("/nonepayed")
    public List<Procurementitempurchase> getAllNonePayed(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all procurementitemtypes' basic data", UsecaseList.SHOW_ALL_PROCUREMENTITEMTYPES, UsecaseList.ADD_PROCUREMENTITEM, UsecaseList.UPDATE_PROCUREMENTITEM);

        List<Procurementitempurchase> procurementitempurchase = procurementitempurchaseDao.findAllNonePayed();

        return procurementitempurchase;
    }


    @GetMapping("/nonerefunded")
    public List<Procurementitempurchase> getAllNoneRefunded(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all procurementitemtypes' basic data", UsecaseList.SHOW_ALL_PROCUREMENTITEMTYPES, UsecaseList.ADD_PROCUREMENTITEM, UsecaseList.UPDATE_PROCUREMENTITEM);

        List<Procurementitempurchase> procurementitempurchase = procurementitempurchaseDao.findAll(DEFAULT_SORT);
        List<Procurementrefund> procurementrefunds = procurementrefundDao.findAll(DEFAULT_SORT);

        if (procurementrefunds.size() != 0){
            ArrayList<Procurementitempurchase> filteredProcurementpurchases = new ArrayList<>();

            procurementitempurchase.forEach(procurementitem -> {
                procurementrefunds.forEach(procurementrefund -> {
                    if (!procurementrefund.getProcurementitempurchase().getId().equals(procurementitem.getId())){
                        filteredProcurementpurchases.add(procurementitem);
                    }
                });
            });
            return filteredProcurementpurchases;
        }else {
            return procurementitempurchase;
        }

    }



}
