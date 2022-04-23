package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Department;
import bit.project.server.dao.DepartmentDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/departments")
public class DepartmentController{

    @Autowired
    private DepartmentDao departmentDao;

    @GetMapping
    public List<Department> getAll(){
        return departmentDao.findAll();
    }
}