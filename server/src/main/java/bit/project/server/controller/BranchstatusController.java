package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Branchstatus;
import bit.project.server.dao.BranchstatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/branchstatuses")
public class BranchstatusController{

    @Autowired
    private BranchstatusDao branchstatusDao;

    @GetMapping
    public List<Branchstatus> getAll(){
        return branchstatusDao.findAll();
    }
}