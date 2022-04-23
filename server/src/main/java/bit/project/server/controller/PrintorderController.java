package bit.project.server.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import bit.project.server.entity.Printorder;
import bit.project.server.dao.PrintorderDao;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import bit.project.server.entity.Printorderstatus;
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
@RequestMapping("/printorders")
public class PrintorderController{

    @Autowired
    private PrintorderDao printorderDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public PrintorderController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("printorder");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("PO");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Printorder> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all printorders", UsecaseList.SHOW_ALL_PRINTORDERS);

        if(pageQuery.isEmptySearch()){
            return printorderDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer branchId = pageQuery.getSearchParamAsInteger("branch");
        Integer materialId = pageQuery.getSearchParamAsInteger("material");
        Integer printorderstatusId = pageQuery.getSearchParamAsInteger("printorderstatus");

        LocalDate startDate = LocalDate.parse(pageQuery.getSearchParam("startDate"));
        LocalDate endtDate = LocalDate.parse(pageQuery.getSearchParam("endtDate"));

        List<Printorder> printorders = printorderDao.findAll(DEFAULT_SORT);
        Stream<Printorder> stream = printorders.parallelStream();

        List<Printorder> filteredPrintorders = stream.filter(printorder -> {

            if (!(startDate.isEqual(LocalDate.parse("1970-01-01")) && endtDate.isEqual(LocalDate.parse("1970-01-01"))))
                if(!((printorder.getRequireddate().isAfter(startDate) && printorder.getRequireddate().isBefore(endtDate))
                        || printorder.getRequireddate().isEqual(startDate) || printorder.getRequireddate().isEqual(endtDate)))
                    return false;

            if(code!=null)
                if(!printorder.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(branchId!=null)
                if(!printorder.getBranch().getId().equals(branchId)) return false;
            if(materialId!=null)
                if(!printorder.getMaterial().getId().equals(materialId)) return false;
            if(printorderstatusId!=null)
                if(!printorder.getPrintorderstatus().getId().equals(printorderstatusId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredPrintorders, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Printorder> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all printorders' basic data", UsecaseList.SHOW_ALL_PRINTORDERS, UsecaseList.ADD_PRINT, UsecaseList.UPDATE_PRINT);
        return printorderDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Printorder get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get printorder", UsecaseList.SHOW_PRINTORDER_DETAILS);
        Optional<Printorder> optionalPrintorder = printorderDao.findById(id);
        if(optionalPrintorder.isEmpty()) throw new ObjectNotFoundException("Printorder not found");
        return optionalPrintorder.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete printorders", UsecaseList.DELETE_PRINTORDER);

        try{
            if(printorderDao.existsById(id)) printorderDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this printorder already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Printorder printorder, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new printorder", UsecaseList.ADD_PRINTORDER);

        printorder.setTocreation(LocalDateTime.now());
        printorder.setCreator(authUser);
        printorder.setId(null);
        printorder.setPrintorderstatus(new Printorderstatus(1));;


        EntityValidator.validate(printorder);

        PersistHelper.save(()->{
            printorder.setCode(codeGenerator.getNextId(codeConfig));
            return printorderDao.save(printorder);
        });

        return new ResourceLink(printorder.getId(), "/printorders/"+printorder.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Printorder printorder, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update printorder details", UsecaseList.UPDATE_PRINTORDER);

        Optional<Printorder> optionalPrintorder = printorderDao.findById(id);
        if(optionalPrintorder.isEmpty()) throw new ObjectNotFoundException("Printorder not found");
        Printorder oldPrintorder = optionalPrintorder.get();

        printorder.setId(id);
        printorder.setCode(oldPrintorder.getCode());
        printorder.setCreator(oldPrintorder.getCreator());
        printorder.setTocreation(oldPrintorder.getTocreation());


        EntityValidator.validate(printorder);

        printorder = printorderDao.save(printorder);
        return new ResourceLink(printorder.getId(), "/printorders/"+printorder.getId());
    }

    @GetMapping("/ordered")
    public List<Printorder> getAllOrdered(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all printorders' basic data", UsecaseList.SHOW_ALL_PRINTORDERS, UsecaseList.ADD_PRINT, UsecaseList.UPDATE_PRINT);
        ArrayList<Printorder> printorders = new ArrayList<>();
        printorderDao.findAllForDashbord().forEach(printorder -> {
            if (printorder.getPrintorderstatus().getId().equals(1)){
                printorders.add(printorder);
            }
        });
        return printorders;
    }

}
