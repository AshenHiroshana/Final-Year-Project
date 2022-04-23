package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Branchsectiontype;
import bit.project.server.dao.BranchsectiontypeDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/branchsectiontypes")
public class BranchsectiontypeController{

    @Autowired
    private BranchsectiontypeDao branchsectiontypeDao;

    @GetMapping
    public List<Branchsectiontype> getAll(){
        return branchsectiontypeDao.findAll();
    }
}