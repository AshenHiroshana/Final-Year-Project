package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Vendorstatus;
import bit.project.server.dao.VendorstatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/vendorstatuses")
public class VendorstatusController{

    @Autowired
    private VendorstatusDao vendorstatusDao;

    @GetMapping
    public List<Vendorstatus> getAll(){
        return vendorstatusDao.findAll();
    }
}