package bit.project.server.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.dao.DesignationDao;
import bit.project.server.dao.NotificationDao;
import bit.project.server.dao.UserDao;
import bit.project.server.entity.*;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import bit.project.server.dao.AppointmentDao;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import org.springframework.data.domain.PageRequest;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.util.validation.EntityValidator;
import bit.project.server.util.exception.ConflictException;
import bit.project.server.util.validation.ValidationErrorBag;
import bit.project.server.util.security.AccessControlManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import bit.project.server.util.exception.DataValidationException;
import bit.project.server.util.exception.ObjectNotFoundException;

@CrossOrigin
@RestController
@RequestMapping("/appointments")
public class AppointmentController{

    @Autowired
    private AppointmentDao appointmentDao;

    @Autowired
    private DesignationDao designationDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private NotificationDao notificationDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public AppointmentController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("appointment");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("AP");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Appointment> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all appointments", UsecaseList.SHOW_ALL_APPOINTMENTS);

        if(pageQuery.isEmptySearch()){
            return appointmentDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer designationId = pageQuery.getSearchParamAsInteger("designation");
        Integer employeeId = pageQuery.getSearchParamAsInteger("employee");
        Integer appointmentstatusId = pageQuery.getSearchParamAsInteger("appointmentstatus");

        List<Appointment> appointments = appointmentDao.findAll(DEFAULT_SORT);
        Stream<Appointment> stream = appointments.parallelStream();

        List<Appointment> filteredAppointments = stream.filter(appointment -> {
            if(code!=null)
                if(!appointment.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(designationId!=null)
                if(!appointment.getDesignation().getId().equals(designationId)) return false;
            if(employeeId!=null)
                if(!appointment.getEmployee().getId().equals(employeeId)) return false;
            if(appointmentstatusId!=null)
                if(!appointment.getAppointmentstatus().getId().equals(appointmentstatusId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredAppointments, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Appointment> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all appointments' basic data", UsecaseList.SHOW_ALL_APPOINTMENTS, UsecaseList.ADD_PAYROLL, UsecaseList.UPDATE_PAYROLL);
        return appointmentDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Appointment get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get appointment", UsecaseList.SHOW_APPOINTMENT_DETAILS);
        Optional<Appointment> optionalAppointment = appointmentDao.findById(id);
        if(optionalAppointment.isEmpty()) throw new ObjectNotFoundException("Appointment not found");
        return optionalAppointment.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete appointments", UsecaseList.DELETE_APPOINTMENT);

        try{
            if(appointmentDao.existsById(id)) appointmentDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this appointment already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Appointment appointment, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new appointment", UsecaseList.ADD_APPOINTMENT);

        appointment.setTocreation(LocalDateTime.now());
        appointment.setCreator(authUser);
        appointment.setId(null);
        appointment.setAppointmentstatus(new Appointmentstatus(1));;
        appointment.setDogrant(LocalDate.now());;
        //LocalDate.parse("1994-12-31")
        if (appointment.getAppointmentallowanceList() != null){
            for(Appointmentallowance appointmentallowance : appointment.getAppointmentallowanceList()) appointmentallowance.setAppointment(appointment);
        }

        EntityValidator.validate(appointment);

        PersistHelper.save(()->{
            appointment.setCode(codeGenerator.getNextId(codeConfig));
            return appointmentDao.save(appointment);
        });


       try {
           Notification notification = new Notification();
           notification.setId(UUID.randomUUID().toString());
           notification.setUser(userDao.findByEmployee(new Employee(appointment.getEmployee().getId())));
           notification.setDosend(LocalDateTime.now());
           Optional<Designation> designation = designationDao.findById(appointment.getDesignation().getId());
           notification.setMessage( " Now you are " + designation.get().getName()  +  " in Earth University ");
           notificationDao.save(notification);
       }catch (Exception e){

       }

        return new ResourceLink(appointment.getId(), "/appointments/"+appointment.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Appointment appointment, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update appointment details", UsecaseList.UPDATE_APPOINTMENT);

        Optional<Appointment> optionalAppointment = appointmentDao.findById(id);
        if(optionalAppointment.isEmpty()) throw new ObjectNotFoundException("Appointment not found");
        Appointment oldAppointment = optionalAppointment.get();

        appointment.setId(id);
        appointment.setCode(oldAppointment.getCode());
        appointment.setCreator(oldAppointment.getCreator());
        appointment.setTocreation(oldAppointment.getTocreation());

        for(Appointmentallowance appointmentallowance : appointment.getAppointmentallowanceList()) appointmentallowance.setAppointment(appointment);

        EntityValidator.validate(appointment);

        appointment = appointmentDao.save(appointment);
        return new ResourceLink(appointment.getId(), "/appointments/"+appointment.getId());
    }

    @GetMapping("/forpayroll/{id}")
    public List<Appointment> getAllForPayroll(@PathVariable Integer id, PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all appointments' basic data", UsecaseList.SHOW_ALL_APPOINTMENTS, UsecaseList.ADD_PAYROLL, UsecaseList.UPDATE_PAYROLL);
        List<Appointment> appointments = appointmentDao.findAll();
        ArrayList<Appointment> appointmentsList = new ArrayList<>();
        appointments.forEach(appointment -> {
            if (appointment.getEmployee().getId().equals(id) && appointment.getAppointmentstatus().getId().equals(1)){
                appointmentsList.add(appointment);
            }
        });
        return appointmentsList;
    }

}
