package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Consumedistributionstatus;
import bit.project.server.dao.ConsumedistributionstatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/consumedistributionstatuses")
public class ConsumedistributionstatusController{

    @Autowired
    private ConsumedistributionstatusDao consumedistributionstatusDao;

    @GetMapping
    public List<Consumedistributionstatus> getAll(){
        return consumedistributionstatusDao.findAll();
    }
}