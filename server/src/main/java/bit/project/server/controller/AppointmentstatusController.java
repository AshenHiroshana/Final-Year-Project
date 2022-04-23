package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Appointmentstatus;
import bit.project.server.dao.AppointmentstatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/appointmentstatuses")
public class AppointmentstatusController{

    @Autowired
    private AppointmentstatusDao appointmentstatusDao;

    @GetMapping
    public List<Appointmentstatus> getAll(){
        return appointmentstatusDao.findAll();
    }
}