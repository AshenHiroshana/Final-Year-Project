package bit.project.server.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.dao.BranchsectionDao;
import bit.project.server.dao.FileDao;
import bit.project.server.entity.*;
import bit.project.server.util.helper.FileHelper;
import org.dom4j.Branch;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.dao.ProcurementitemDao;
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
@RequestMapping("/procurementitems")
public class ProcurementitemController{

    @Autowired
    private ProcurementitemDao procurementitemDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private FileDao fileDao;


    @Autowired
    private CodeGenerator codeGenerator;

    @Autowired
    private BranchsectionDao branchsectionDao;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ProcurementitemController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("procurementitem");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("PI");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Procurementitem> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all procurementitems", UsecaseList.SHOW_ALL_PROCUREMENTITEMS);

        if(pageQuery.isEmptySearch()){
            return procurementitemDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        Integer vendorId = pageQuery.getSearchParamAsInteger("vendor");
        Integer procurementitemtypeId = pageQuery.getSearchParamAsInteger("procurementitemtype");
        Integer procurementitemstatusId = pageQuery.getSearchParamAsInteger("procurementitemstatus");

        List<Procurementitem> procurementitems = procurementitemDao.findAll(DEFAULT_SORT);
        Stream<Procurementitem> stream = procurementitems.parallelStream();

        List<Procurementitem> filteredProcurementitems = stream.filter(procurementitem -> {
            if(vendorId!=null)
                if(!procurementitem.getVendor().getId().equals(vendorId)) return false;
            if(procurementitemtypeId!=null)
                if(!procurementitem.getProcurementitemtype().getId().equals(procurementitemtypeId)) return false;
            if(procurementitemstatusId!=null)
                if(!procurementitem.getProcurementitemstatus().getId().equals(procurementitemstatusId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredProcurementitems, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Procurementitem> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all procurementitems' basic data", UsecaseList.SHOW_ALL_PROCUREMENTITEMS, UsecaseList.ADD_AUCTION, UsecaseList.UPDATE_AUCTION, UsecaseList.ADD_PROCUREMENTREFUND, UsecaseList.UPDATE_PROCUREMENTREFUND);
        return procurementitemDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Procurementitem get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get procurementitem", UsecaseList.SHOW_PROCUREMENTITEM_DETAILS);
        Optional<Procurementitem> optionalProcurementitem = procurementitemDao.findById(id);
        if(optionalProcurementitem.isEmpty()) throw new ObjectNotFoundException("Procurementitem not found");
        return optionalProcurementitem.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete procurementitems", UsecaseList.DELETE_PROCUREMENTITEM);

        try{
            if(procurementitemDao.existsById(id)) procurementitemDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this procurementitem already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Procurementitem procurementitem, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new procurementitem", UsecaseList.ADD_PROCUREMENTITEM);

        procurementitem.setTocreation(LocalDateTime.now());
        procurementitem.setCreator(authUser);
        procurementitem.setId(null);
        procurementitem.setProcurementitemstatus(new Procurementitemstatus(1));;


        EntityValidator.validate(procurementitem);

        PersistHelper.save(()->{
            procurementitem.setCode(codeGenerator.getNextId(codeConfig));
            return procurementitemDao.save(procurementitem);
        });

        return new ResourceLink(procurementitem.getId(), "/procurementitems/"+procurementitem.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Procurementitem procurementitem, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update procurementitem details", UsecaseList.UPDATE_PROCUREMENTITEM);

        Optional<Procurementitem> optionalProcurementitem = procurementitemDao.findById(id);
        if(optionalProcurementitem.isEmpty()) throw new ObjectNotFoundException("Procurementitem not found");
        Procurementitem oldProcurementitem = optionalProcurementitem.get();

        procurementitem.setId(id);
        procurementitem.setCode(oldProcurementitem.getCode());
        procurementitem.setCreator(oldProcurementitem.getCreator());
        procurementitem.setTocreation(oldProcurementitem.getTocreation());


        EntityValidator.validate(procurementitem);

        procurementitem = procurementitemDao.save(procurementitem);
        return new ResourceLink(procurementitem.getId(), "/procurementitems/"+procurementitem.getId());
    }

    @GetMapping("/itembypurchase/{id}")
    public List<Procurementitem> getAllItemByPurchase(@PathVariable Integer id,PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all procurementitems' basic data", UsecaseList.SHOW_ALL_PROCUREMENTITEMS, UsecaseList.ADD_AUCTION, UsecaseList.UPDATE_AUCTION, UsecaseList.ADD_PROCUREMENTREFUND, UsecaseList.UPDATE_PROCUREMENTREFUND);
        List<Procurementitem> procurementitems =  procurementitemDao.findAll(DEFAULT_SORT);
        ArrayList<Procurementitem> filteredProcurementitems = new ArrayList<>();
        procurementitems.forEach(procurementitem -> {
            if (procurementitem.getProcurementitempurchase() != null){
                if (procurementitem.getProcurementitempurchase().getId().equals(id)){
                    filteredProcurementitems.add(procurementitem);
                }
            }
        });
        return filteredProcurementitems;
    }

    @GetMapping("/itembypurchaseforrefund/{id}")
    public List<Procurementitem> getAllItemByPurchaseForRefund(@PathVariable Integer id,PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all procurementitems' basic data", UsecaseList.SHOW_ALL_PROCUREMENTITEMS, UsecaseList.ADD_AUCTION, UsecaseList.UPDATE_AUCTION, UsecaseList.ADD_PROCUREMENTREFUND, UsecaseList.UPDATE_PROCUREMENTREFUND);
        List<Procurementitem> procurementitems =  procurementitemDao.findAll(DEFAULT_SORT);
        ArrayList<Procurementitem> filteredProcurementitems = new ArrayList<>();
        procurementitems.forEach(procurementitem -> {
            if (procurementitem.getProcurementitempurchase() != null){
                if (procurementitem.getProcurementitempurchase().getId().equals(id)){
                    if (procurementitem.getProcurementitemstatus().getId().equals(1)){
                        filteredProcurementitems.add(procurementitem);
                    }
                }
            }
        });
        return filteredProcurementitems;
    }


    @GetMapping("/itemforallocation")
    public List<Procurementitem> getAllItemForAllocation(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all procurementitems' basic data", UsecaseList.SHOW_ALL_PROCUREMENTITEMS, UsecaseList.ADD_AUCTION, UsecaseList.UPDATE_AUCTION, UsecaseList.ADD_PROCUREMENTREFUND, UsecaseList.UPDATE_PROCUREMENTREFUND);
        List<Procurementitem> procurementitems =  procurementitemDao.findAll(DEFAULT_SORT);
        ArrayList<Procurementitem> filteredProcurementitems = new ArrayList<>();
        procurementitems.forEach(procurementitem -> {
            if (procurementitem.getProcurementitemstatus().getId().equals(1) || procurementitem.getProcurementitemstatus().getId().equals(3)){
                filteredProcurementitems.add(procurementitem);
            }
        });
        return filteredProcurementitems;
    }

    @GetMapping("/itembybranchsection/{id}")
    public List<Procurementitem> getAllByBranchSection(@PathVariable Integer id,PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all procurementitems' basic data", UsecaseList.SHOW_ALL_PROCUREMENTITEMS, UsecaseList.ADD_AUCTION, UsecaseList.UPDATE_AUCTION, UsecaseList.ADD_PROCUREMENTREFUND, UsecaseList.UPDATE_PROCUREMENTREFUND);
        Optional<Branchsection> optionalBranchsection =  branchsectionDao.findById(id);
        ArrayList<Procurementitem> procurementitems = new ArrayList<>();
        if (optionalBranchsection.isPresent()){
            optionalBranchsection.get().getBranchsectionProcurementallocationList().forEach(procurementallocation -> {
                procurementallocation.getProcurementallocationprocurementitemList().forEach(procurementallocationprocurementitem -> {
                    procurementitems.add(procurementallocationprocurementitem.getProcurementitem());
                });
            });
        }
        return procurementitems;
    }

    @GetMapping("/{id}/photo")
    public HashMap<String, String> getPhoto(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get user photo", UsecaseList.SHOW_BRANCH_DETAILS);

        Optional<Procurementitem> optionalEmployee = procurementitemDao.findById(id);

        Optional<File> optionalFile = fileDao.findFileById(optionalEmployee.get().getItemphoto());

        if(optionalFile.isEmpty()) {
            throw new ObjectNotFoundException("Photo not found");
        }

        File photo = optionalFile.get();
        HashMap<String, String> data = new HashMap<>();

        data.put("file", FileHelper.byteArrayToBase64(photo.getFile(), photo.getFilemimetype()));

        return data;
    }

    @GetMapping("/{id}/invoice")
    public HashMap<String, String> getInvoice(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get user photo", UsecaseList.SHOW_BRANCH_DETAILS);

        Optional<Procurementitem> optionalEmployee = procurementitemDao.findById(id);

        Optional<File> optionalFile = fileDao.findFileById(optionalEmployee.get().getInvoice());

        if(optionalFile.isEmpty()) {
            throw new ObjectNotFoundException("Photo not found");
        }

        File photo = optionalFile.get();
        HashMap<String, String> data = new HashMap<>();

        data.put("file", FileHelper.byteArrayToBase64(photo.getFile(), photo.getFilemimetype()));

        return data;
    }

    @GetMapping("/{id}/warrantyphoto")
    public HashMap<String, String> getWarrantyphoto(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get user photo", UsecaseList.SHOW_BRANCH_DETAILS);

        Optional<Procurementitem> optionalEmployee = procurementitemDao.findById(id);

        Optional<File> optionalFile = fileDao.findFileById(optionalEmployee.get().getWarrantyphoto());

        if(optionalFile.isEmpty()) {
            throw new ObjectNotFoundException("Photo not found");
        }

        File photo = optionalFile.get();
        HashMap<String, String> data = new HashMap<>();

        data.put("file", FileHelper.byteArrayToBase64(photo.getFile(), photo.getFilemimetype()));

        return data;
    }


}
