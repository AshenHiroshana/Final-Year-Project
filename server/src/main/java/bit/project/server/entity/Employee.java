package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import java.time.LocalDate;
import javax.persistence.Id;
import javax.persistence.Lob;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Employee{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String callingname;

    private String fullname;

    private String photo;

    private LocalDate dobirth;

    private String nic;

    @Lob
    private String address;

    private String mobile;

    private String land;

    private String email;

    private LocalDate dorecruit;

    private String epfno;

    private LocalDate doresigned;

    private String bankaccountno;

    private String bankname;

    private String bankbranch;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Nametitle nametitle;

    @ManyToOne
    private Gender gender;

    @ManyToOne
    private Civilstatus civilstatus;

    @ManyToOne
    private Employeestatus employeestatus;

    @OneToMany(mappedBy="employee", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Educationqualification> educationqualificationList;

    @OneToMany(mappedBy="employee", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Workexperience> workexperienceList;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "employee")
    private List<Appointment> employeeAppointmentList;

    @JsonIgnore
    @OneToMany(mappedBy = "employee")
    private List<Attendance> employeeAttendanceList;

    @JsonIgnore
    @OneToMany(mappedBy = "employee")
    private List<Branchroleassignment> employeeBranchroleassignmentList;

    @JsonIgnore
    @OneToMany(mappedBy = "employee")
    private List<Payroll> employeePayrollList;


    @ManyToMany
        @JoinTable(
        name="employeebranch",
        joinColumns=@JoinColumn(name="employee_id", referencedColumnName="id"),
        inverseJoinColumns=@JoinColumn(name="branch_id", referencedColumnName="id")
    )
    private List<Branch> branchList;


    public Employee(Integer id){
        this.id = id;
    }

    public Employee(Integer id, String code, Nametitle nametitle, String callingname, String photo){
        this.id = id;
        this.code = code;
        this.nametitle = nametitle;
        this.callingname = callingname;
        this.photo = photo;
    }

}