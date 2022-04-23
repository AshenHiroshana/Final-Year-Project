package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Printstatus;
import bit.project.server.dao.PrintstatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/printstatuses")
public class PrintstatusController{

    @Autowired
    private PrintstatusDao printstatusDao;

    @GetMapping
    public List<Printstatus> getAll(){
        return printstatusDao.findAll();
    }
}