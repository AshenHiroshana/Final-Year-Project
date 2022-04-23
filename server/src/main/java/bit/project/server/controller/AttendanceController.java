package bit.project.server.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.dao.EmployeeDao;
import bit.project.server.entity.Employee;
import bit.project.server.entity.User;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import bit.project.server.entity.Attendance;
import bit.project.server.dao.AttendanceDao;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
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
import bit.project.server.util.security.AccessControlManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import bit.project.server.util.exception.ObjectNotFoundException;

@CrossOrigin
@RestController
@RequestMapping("/attendances")
public class AttendanceController{

    @Autowired
    private AttendanceDao attendanceDao;

    @Autowired
    private EmployeeDao employeeDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public AttendanceController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("attendance");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("EA");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Attendance> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all attendances", UsecaseList.SHOW_ALL_ATTENDANCES);

        if(pageQuery.isEmptySearch()){
            return attendanceDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer branchId = pageQuery.getSearchParamAsInteger("branch");
        Integer employeeId = pageQuery.getSearchParamAsInteger("employee");

        List<Attendance> attendances = attendanceDao.findAll(DEFAULT_SORT);
        Stream<Attendance> stream = attendances.parallelStream();

        List<Attendance> filteredAttendances = stream.filter(attendance -> {
            if(code!=null)
                if(!attendance.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(branchId!=null)
                if(!attendance.getBranch().getId().equals(branchId)) return false;
            if(employeeId!=null)
                if(!attendance.getEmployee().getId().equals(employeeId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredAttendances, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Attendance> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all attendances' basic data", UsecaseList.SHOW_ALL_ATTENDANCES);
        return attendanceDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Attendance get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get attendance", UsecaseList.SHOW_ATTENDANCE_DETAILS);
        Optional<Attendance> optionalAttendance = attendanceDao.findById(id);
        if(optionalAttendance.isEmpty()) throw new ObjectNotFoundException("Attendance not found");
        return optionalAttendance.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete attendances", UsecaseList.DELETE_ATTENDANCE);

        try{
            if(attendanceDao.existsById(id)) attendanceDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this attendance already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Attendance attendance, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new attendance", UsecaseList.ADD_ATTENDANCE);

        attendance.setTocreation(LocalDateTime.now());
        attendance.setCreator(authUser);
        attendance.setId(null);
        attendance.setDate(LocalDate.now());

        Optional<Employee> optionalEmployee = employeeDao.findById(attendance.getEmployee().getId());
        Employee employee = optionalEmployee.get();


        String[] intime = attendance.getIntime().split(":");
        String intimeHours = intime[0];
        String intimeMinutes = intime[1];
        String[] outtime = attendance.getIntime().split(":");
        String outtimeHours = outtime[0];
        String outtimeMinutes = outtime[1];



        List<Attendance> attendances = this.attendanceDao.findAllByEmployee(attendance.getEmployee().getId());
        if (!attendances.isEmpty()){
            System.out.println('a');
            attendances.forEach(oldattendance -> {

                System.out.println(oldattendance.getDate());
                System.out.println(attendance.getDate());

                if (oldattendance.getDate().equals(attendance.getDate())){
                    throw new ObjectNotFoundException("be");
                }

           /*     String[] oldintime = oldattendance.getIntime().split(":");
                String oldintimeHours = oldintime[0];
                String oldintimeMinutes = oldintime[1];
                String[] oldouttime = oldattendance.getIntime().split(":");
                String oldouttimeHours = oldouttime[0];
                String oldouttimeMinutes = oldouttime[1];
                if (Integer.parseInt(oldouttimeHours) >= Integer.parseInt(intimeHours)){
                    System.out.println(oldouttimeHours);
                    System.out.println(intimeHours);
                    System.out.println('b');
                    throw new ObjectNotFoundException("be");
                }
                if (Integer.parseInt(oldintimeHours) >= Integer.parseInt(outtimeHours)){
                    System.out.println('c');
                    throw new ObjectNotFoundException("be");
                }*/
            });
        }


        EntityValidator.validate(attendance);


        PersistHelper.save(()->{
            attendance.setCode(codeGenerator.getNextId(codeConfig));
            return attendanceDao.save(attendance);
        });

        return new ResourceLink(attendance.getId(), "/attendances/"+attendance.getId());

    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Attendance attendance, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update attendance details", UsecaseList.UPDATE_ATTENDANCE);

        Optional<Attendance> optionalAttendance = attendanceDao.findById(id);
        if(optionalAttendance.isEmpty()) throw new ObjectNotFoundException("Attendance not found");
        Attendance oldAttendance = optionalAttendance.get();

        attendance.setId(id);
        attendance.setCode(oldAttendance.getCode());
        attendance.setCreator(oldAttendance.getCreator());
        attendance.setTocreation(oldAttendance.getTocreation());


        EntityValidator.validate(attendance);

        attendance = attendanceDao.save(attendance);
        return new ResourceLink(attendance.getId(), "/attendances/"+attendance.getId());
    }

    @GetMapping("/byemployeeandmonth/{id}")
    public List<Attendance> getAllByEmployeeMonth(@PathVariable Integer id,PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all attendances' basic data", UsecaseList.SHOW_ALL_ATTENDANCES);
        List<Attendance> attendanceList = attendanceDao.findAll();
        ArrayList<Attendance> attendances = new ArrayList<>();
        attendanceList.forEach(attendance -> {
            if (attendance.getEmployee().getId().equals(id)){
                if (attendance.getDate().getYear() == LocalDate.now().getYear()){
                    if (attendance.getDate().getMonth() == LocalDate.now().getMonth()){
                        attendances.add(attendance);
                    }
                }
            }
        });

        return attendances;
    }
}
