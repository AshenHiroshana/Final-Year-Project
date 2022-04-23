package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Branchsectionstatus;
import bit.project.server.dao.BranchsectionstatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/branchsectionstatuses")
public class BranchsectionstatusController{

    @Autowired
    private BranchsectionstatusDao branchsectionstatusDao;

    @GetMapping
    public List<Branchsectionstatus> getAll(){
        return branchsectionstatusDao.findAll();
    }
}