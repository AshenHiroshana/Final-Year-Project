package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Billpaymenttype;
import bit.project.server.dao.BillpaymenttypeDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/billpaymenttypes")
public class BillpaymenttypeController{

    @Autowired
    private BillpaymenttypeDao billpaymenttypeDao;

    @GetMapping
    public List<Billpaymenttype> getAll(){
        return billpaymenttypeDao.findAll();
    }
}
