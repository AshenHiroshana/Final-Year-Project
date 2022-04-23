package bit.project.server.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import bit.project.server.entity.Material;
import bit.project.server.dao.MaterialDao;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import bit.project.server.entity.Materialstatus;
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
@RequestMapping("/materials")
public class MaterialController{

    @Autowired
    private MaterialDao materialDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public MaterialController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("material");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("ME");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Material> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all materials", UsecaseList.SHOW_ALL_MATERIALS);

        if(pageQuery.isEmptySearch()){
            return materialDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String name = pageQuery.getSearchParam("name");
        Integer pagecount = pageQuery.getSearchParamAsInteger("pagecount");
        Integer materialtypeId = pageQuery.getSearchParamAsInteger("materialtype");
        Integer materialstatusId = pageQuery.getSearchParamAsInteger("materialstatus");

        List<Material> materials = materialDao.findAll(DEFAULT_SORT);
        Stream<Material> stream = materials.parallelStream();

        List<Material> filteredMaterials = stream.filter(material -> {
            if(name!=null)
                if(!material.getName().toLowerCase().contains(name.toLowerCase())) return false;
            if(pagecount!=null)
                if(!material.getPagecount().equals(pagecount)) return false;
            if(materialtypeId!=null)
                if(!material.getMaterialtype().getId().equals(materialtypeId)) return false;
            if(materialstatusId!=null)
                if(!material.getMaterialstatus().getId().equals(materialstatusId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredMaterials, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Material> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all materials' basic data", UsecaseList.SHOW_ALL_MATERIALS, UsecaseList.ADD_PRINTORDER, UsecaseList.UPDATE_PRINTORDER);
        return materialDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Material get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get material", UsecaseList.SHOW_MATERIAL_DETAILS);
        Optional<Material> optionalMaterial = materialDao.findById(id);
        if(optionalMaterial.isEmpty()) throw new ObjectNotFoundException("Material not found");
        return optionalMaterial.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete materials", UsecaseList.DELETE_MATERIAL);

        try{
            if(materialDao.existsById(id)) materialDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this material already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Material material, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new material", UsecaseList.ADD_MATERIAL);

        material.setTocreation(LocalDateTime.now());
        material.setCreator(authUser);
        material.setId(null);
        material.setMaterialstatus(new Materialstatus(1));;


        EntityValidator.validate(material);

        PersistHelper.save(()->{
            material.setCode(codeGenerator.getNextId(codeConfig));
            return materialDao.save(material);
        });

        return new ResourceLink(material.getId(), "/materials/"+material.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Material material, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update material details", UsecaseList.UPDATE_MATERIAL);

        Optional<Material> optionalMaterial = materialDao.findById(id);
        if(optionalMaterial.isEmpty()) throw new ObjectNotFoundException("Material not found");
        Material oldMaterial = optionalMaterial.get();

        material.setId(id);
        material.setCode(oldMaterial.getCode());
        material.setCreator(oldMaterial.getCreator());
        material.setTocreation(oldMaterial.getTocreation());


        EntityValidator.validate(material);

        material = materialDao.save(material);
        return new ResourceLink(material.getId(), "/materials/"+material.getId());
    }

    @GetMapping("/forprintorder")
    public List<Material> getAllForPrintOrder(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all materials' basic data", UsecaseList.SHOW_ALL_MATERIALS, UsecaseList.ADD_PRINTORDER, UsecaseList.UPDATE_PRINTORDER);
        List<Material> materialList =  materialDao.findAll();
        ArrayList<Material> materials = new ArrayList<>();
        if (materialList != null){
            materialList.forEach(material -> {
                if(material.getMaterialstatus().getId().equals(1)){
                    materials.add(material);
                }
            });
        }
        return materials;
    }

}
