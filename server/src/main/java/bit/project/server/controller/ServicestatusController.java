package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Servicestatus;
import bit.project.server.dao.ServicestatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/servicestatuses")
public class ServicestatusController{

    @Autowired
    private ServicestatusDao servicestatusDao;

    @GetMapping
    public List<Servicestatus> getAll(){
        return servicestatusDao.findAll();
    }
}