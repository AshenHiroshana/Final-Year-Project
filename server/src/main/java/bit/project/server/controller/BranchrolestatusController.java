package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Branchrolestatus;
import bit.project.server.dao.BranchrolestatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/branchrolestatuses")
public class BranchrolestatusController{

    @Autowired
    private BranchrolestatusDao branchrolestatusDao;

    @GetMapping
    public List<Branchrolestatus> getAll(){
        return branchrolestatusDao.findAll();
    }
}