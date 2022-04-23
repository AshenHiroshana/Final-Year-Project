package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Procurementitemstatus;
import bit.project.server.dao.ProcurementitemstatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/procurementitemstatuses")
public class ProcurementitemstatusController{

    @Autowired
    private ProcurementitemstatusDao procurementitemstatusDao;

    @GetMapping
    public List<Procurementitemstatus> getAll(){
        return procurementitemstatusDao.findAll();
    }
}