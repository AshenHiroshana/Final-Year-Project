package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Buyingcondition;
import bit.project.server.dao.BuyingconditionDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/buyingconditions")
public class BuyingconditionController{

    @Autowired
    private BuyingconditionDao buyingconditionDao;

    @GetMapping
    public List<Buyingcondition> getAll(){
        return buyingconditionDao.findAll();
    }
}