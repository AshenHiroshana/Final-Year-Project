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
public class Appointment{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private LocalDate dogrant;

    private LocalDate dorevoke;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Designation designation;

    @ManyToOne
    private Employee employee;

    @ManyToOne
    private Appointmentstatus appointmentstatus;

    @OneToMany(mappedBy="appointment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Appointmentallowance> appointmentallowanceList;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "appointment")
    private List<Payroll> appointmentPayrollList;


    public Appointment(Integer id){
        this.id = id;
    }

    public Appointment(Integer id, String code, Employee employee){
        this.id = id;
        this.code = code;
        this.employee = employee;
    }

}