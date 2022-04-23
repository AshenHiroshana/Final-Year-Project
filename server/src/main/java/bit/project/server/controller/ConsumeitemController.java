package bit.project.server.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.dao.FileDao;
import bit.project.server.entity.Branchsection;
import bit.project.server.entity.File;
import bit.project.server.entity.User;
import bit.project.server.util.helper.FileHelper;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import bit.project.server.entity.Consumeitem;
import bit.project.server.dao.ConsumeitemDao;
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
@RequestMapping("/consumeitems")
public class ConsumeitemController{

    @Autowired
    private ConsumeitemDao consumeitemDao;

    @Autowired
    private FileDao fileDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ConsumeitemController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("consumeitem");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("CI");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Consumeitem> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all consumeitems", UsecaseList.SHOW_ALL_CONSUMEITEMS);

        if(pageQuery.isEmptySearch()){
            return consumeitemDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer consumeitemcategoryId = pageQuery.getSearchParamAsInteger("consumeitemcategory");
        String name = pageQuery.getSearchParam("name");

        List<Consumeitem> consumeitems = consumeitemDao.findAll(DEFAULT_SORT);
        Stream<Consumeitem> stream = consumeitems.parallelStream();

        List<Consumeitem> filteredConsumeitems = stream.filter(consumeitem -> {
            if(code!=null)
                if(!consumeitem.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(consumeitemcategoryId!=null)
                if(!consumeitem.getConsumeitemcategory().getId().equals(consumeitemcategoryId)) return false;
            if(name!=null)
                if(!consumeitem.getName().toLowerCase().contains(name.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredConsumeitems, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Consumeitem> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all consumeitems' basic data", UsecaseList.SHOW_ALL_CONSUMEITEMS);
        return consumeitemDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Consumeitem get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get consumeitem", UsecaseList.SHOW_CONSUMEITEM_DETAILS);
        Optional<Consumeitem> optionalConsumeitem = consumeitemDao.findById(id);
        if(optionalConsumeitem.isEmpty()) throw new ObjectNotFoundException("Consumeitem not found");
        return optionalConsumeitem.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete consumeitems", UsecaseList.DELETE_CONSUMEITEM);

        try{
            if(consumeitemDao.existsById(id)) consumeitemDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this consumeitem already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Consumeitem consumeitem, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new consumeitem", UsecaseList.ADD_CONSUMEITEM);

        consumeitem.setTocreation(LocalDateTime.now());
        consumeitem.setCreator(authUser);
        consumeitem.setId(null);


        EntityValidator.validate(consumeitem);

        PersistHelper.save(()->{
            consumeitem.setCode(codeGenerator.getNextId(codeConfig));
            return consumeitemDao.save(consumeitem);
        });

        return new ResourceLink(consumeitem.getId(), "/consumeitems/"+consumeitem.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Consumeitem consumeitem, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update consumeitem details", UsecaseList.UPDATE_CONSUMEITEM);

        Optional<Consumeitem> optionalConsumeitem = consumeitemDao.findById(id);
        if(optionalConsumeitem.isEmpty()) throw new ObjectNotFoundException("Consumeitem not found");
        Consumeitem oldConsumeitem = optionalConsumeitem.get();

        consumeitem.setId(id);
        consumeitem.setCode(oldConsumeitem.getCode());
        consumeitem.setCreator(oldConsumeitem.getCreator());
        consumeitem.setTocreation(oldConsumeitem.getTocreation());


        EntityValidator.validate(consumeitem);

        consumeitem = consumeitemDao.save(consumeitem);
        return new ResourceLink(consumeitem.getId(), "/consumeitems/"+consumeitem.getId());
    }

    @GetMapping("/byvendor/{id}")
    public List<Consumeitem> getAllByVendor(@PathVariable Integer id,PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all consumeitems' basic data", UsecaseList.SHOW_ALL_CONSUMEITEMS);
        List<Consumeitem> consumeitemList =  consumeitemDao.findAll();
        ArrayList<Consumeitem> consumeitems = new ArrayList<>();
        consumeitemList.forEach(consumeitem -> {
            if (consumeitem.getVendorList() != null){
                consumeitem.getVendorList().forEach(vendor -> {
                    if (vendor.getId().equals(id)){
                        consumeitems.add(consumeitem);
                    }
                });
            }
        });
        return consumeitems;
    }

    @GetMapping("/{id}/photo")
    public HashMap<String, String> getPhoto(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get user photo", UsecaseList.SHOW_BRANCH_DETAILS);

        Optional<Consumeitem> optionalEmployee = consumeitemDao.findById(id);

        Optional<File> optionalFile = fileDao.findFileById(optionalEmployee.get().getPhoto());

        if(optionalFile.isEmpty()) {
            throw new ObjectNotFoundException("Photo not found");
        }

        File photo = optionalFile.get();
        HashMap<String, String> data = new HashMap<>();

        data.put("file", FileHelper.byteArrayToBase64(photo.getFile(), photo.getFilemimetype()));

        return data;
    }


}
