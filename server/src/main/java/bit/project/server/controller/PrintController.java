package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import bit.project.server.entity.Print;
import bit.project.server.dao.PrintDao;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.entity.Printstatus;
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
@RequestMapping("/prints")
public class PrintController{

    @Autowired
    private PrintDao printDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public PrintController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("print");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("PRI");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Print> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all prints", UsecaseList.SHOW_ALL_PRINTS);

        if(pageQuery.isEmptySearch()){
            return printDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer printorderId = pageQuery.getSearchParamAsInteger("printorder");
        Integer printstatusId = pageQuery.getSearchParamAsInteger("printstatus");

        List<Print> prints = printDao.findAll(DEFAULT_SORT);
        Stream<Print> stream = prints.parallelStream();

        List<Print> filteredPrints = stream.filter(print -> {
            if(code!=null)
                if(!print.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(printorderId!=null)
                if(!print.getPrintorder().getId().equals(printorderId)) return false;
            if(printstatusId!=null)
                if(!print.getPrintstatus().getId().equals(printstatusId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredPrints, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Print> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all prints' basic data", UsecaseList.SHOW_ALL_PRINTS);
        return printDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Print get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get print", UsecaseList.SHOW_PRINT_DETAILS);
        Optional<Print> optionalPrint = printDao.findById(id);
        if(optionalPrint.isEmpty()) throw new ObjectNotFoundException("Print not found");
        return optionalPrint.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete prints", UsecaseList.DELETE_PRINT);

        try{
            if(printDao.existsById(id)) printDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this print already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Print print, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new print", UsecaseList.ADD_PRINT);

        print.setTocreation(LocalDateTime.now());
        print.setCreator(authUser);
        print.setId(null);
        print.setPrintstatus(new Printstatus(1));;


        EntityValidator.validate(print);

        PersistHelper.save(()->{
            print.setCode(codeGenerator.getNextId(codeConfig));
            return printDao.save(print);
        });

        return new ResourceLink(print.getId(), "/prints/"+print.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Print print, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update print details", UsecaseList.UPDATE_PRINT);

        Optional<Print> optionalPrint = printDao.findById(id);
        if(optionalPrint.isEmpty()) throw new ObjectNotFoundException("Print not found");
        Print oldPrint = optionalPrint.get();

        print.setId(id);
        print.setCode(oldPrint.getCode());
        print.setCreator(oldPrint.getCreator());
        print.setTocreation(oldPrint.getTocreation());


        EntityValidator.validate(print);

        print = printDao.save(print);
        return new ResourceLink(print.getId(), "/prints/"+print.getId());
    }

}