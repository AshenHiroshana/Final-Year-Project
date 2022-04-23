package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Rentalstatus;
import bit.project.server.dao.RentalstatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/rentalstatuses")
public class RentalstatusController{

    @Autowired
    private RentalstatusDao rentalstatusDao;

    @GetMapping
    public List<Rentalstatus> getAll(){
        return rentalstatusDao.findAll();
    }
}