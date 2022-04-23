package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import javax.persistence.Id;
import java.math.BigDecimal;
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
public class Designation{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String name;

    private BigDecimal basicsalary;

    private LocalDateTime tocreation;


    @ManyToOne
    private Department department;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "designation")
    private List<Appointment> designationAppointmentList;


    public Designation(Integer id){
        this.id = id;
    }

    public Designation(Integer id, String code, String name, Department department){
        this.id = id;
        this.code = code;
        this.name = name;
        this.department = department;
    }

}