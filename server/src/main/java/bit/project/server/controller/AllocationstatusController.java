package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Allocationstatus;
import bit.project.server.dao.AllocationstatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/allocationstatuses")
public class AllocationstatusController{

    @Autowired
    private AllocationstatusDao allocationstatusDao;

    @GetMapping
    public List<Allocationstatus> getAll(){
        return allocationstatusDao.findAll();
    }
}