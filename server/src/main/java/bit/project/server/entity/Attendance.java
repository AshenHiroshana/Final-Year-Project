package bit.project.server.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import javax.persistence.Id;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Attendance{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private LocalDate date;

    private String intime;

    private String outtime;

    private LocalDateTime tocreation;


    @ManyToOne
    private Branch branch;

    @ManyToOne
    private Employee employee;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    public Attendance(Integer id){
        this.id = id;
    }

    public Attendance(Integer id, String code, Employee employee, LocalDate date){
        this.id = id;
        this.code = code;
        this.employee = employee;
        this.date = date;
    }

}
