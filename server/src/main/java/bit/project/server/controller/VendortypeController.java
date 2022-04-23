package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Vendortype;
import bit.project.server.dao.VendortypeDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/vendortypes")
public class VendortypeController{

    @Autowired
    private VendortypeDao vendortypeDao;

    @GetMapping
    public List<Vendortype> getAll(){
        return vendortypeDao.findAll();
    }
}