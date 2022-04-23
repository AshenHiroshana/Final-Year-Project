package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Branchroleassignmentstatus;
import bit.project.server.dao.BranchroleassignmentstatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/branchroleassignmentstatuses")
public class BranchroleassignmentstatusController{

    @Autowired
    private BranchroleassignmentstatusDao branchroleassignmentstatusDao;

    @GetMapping
    public List<Branchroleassignmentstatus> getAll(){
        return branchroleassignmentstatusDao.findAll();
    }
}