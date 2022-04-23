package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Consumeitemcategory;
import bit.project.server.dao.ConsumeitemcategoryDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/consumeitemcategories")
public class ConsumeitemcategoryController{

    @Autowired
    private ConsumeitemcategoryDao consumeitemcategoryDao;

    @GetMapping
    public List<Consumeitemcategory> getAll(){
        return consumeitemcategoryDao.findAll();
    }
}