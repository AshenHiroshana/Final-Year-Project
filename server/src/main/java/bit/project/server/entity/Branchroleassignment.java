package bit.project.server.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDate;
import javax.persistence.Id;
import java.math.BigDecimal;
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
public class Branchroleassignment{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private LocalDate dogrant;

    private LocalDate dorevoke;

    private BigDecimal allowance;

    private LocalDateTime tocreation;


    @ManyToOne
    private Branch branch;

    @ManyToOne
    private Branchrole branchrole;

    @ManyToOne
    private Employee employee;

    @ManyToOne
    private Branchroleassignmentstatus branchroleassignmentstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    public Branchroleassignment(Integer id){
        this.id = id;
    }

    public Branchroleassignment(Integer id, String code, Branch branch, Branchrole branchrole){
        this.id = id;
        this.code = code;
        this.branch = branch;
        this.branchrole = branchrole;
    }

}