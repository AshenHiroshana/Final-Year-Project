package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Printorderstatus;
import bit.project.server.dao.PrintorderstatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/printorderstatuses")
public class PrintorderstatusController{

    @Autowired
    private PrintorderstatusDao printorderstatusDao;

    @GetMapping
    public List<Printorderstatus> getAll(){
        return printorderstatusDao.findAll();
    }
}