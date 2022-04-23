package bit.project.server.entity;

import lombok.Data;
import java.util.List;
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
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Rental{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String name;

    private LocalDate date;

    private BigDecimal amount;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Branch branch;

    @ManyToOne
    private Rentalstatus rentalstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "rental")
    private List<Rentalpayment> rentalRentalpaymentList;


    public Rental(Integer id){
        this.id = id;
    }

    public Rental(Integer id, String code, Branch branch, String name){
        this.id = id;
        this.code = code;
        this.branch = branch;
        this.name = name;
    }

}