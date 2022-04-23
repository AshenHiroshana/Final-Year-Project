package bit.project.server.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDate;
import javax.persistence.Id;
import java.math.BigDecimal;
import javax.persistence.Lob;
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
public class Billpayment{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String title;

    private BigDecimal amount;

    private LocalDate date;

    private String photo;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Billpaymenttype billpaymenttype;

    @ManyToOne
    private Branch branch;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    public Billpayment(Integer id){
        this.id = id;
    }

    public Billpayment(Integer id, String code, String title, Branch branch, BigDecimal amount, String photo){
        this.id = id;
        this.code = code;
        this.title = title;
        this.branch = branch;
        this.amount = amount;
        this.photo = photo;
    }

}