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
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Procurementrefund{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private LocalDate date;

    private BigDecimal amount;

    private String chequeno;

    private LocalDate chequedate;

    private String chequebank;

    private String chequebranch;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Procurementitempurchase procurementitempurchase;

    @ManyToOne
    private Paymentstatus paymentstatus;

    @ManyToOne
    private Paymenttype paymenttype;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @ManyToMany
        @JoinTable(
        name="procurementrefundprocurementitem",
        joinColumns=@JoinColumn(name="procurementrefund_id", referencedColumnName="id"),
        inverseJoinColumns=@JoinColumn(name="procurementitem_id", referencedColumnName="id")
    )
    private List<Procurementitem> procurementitemList;


    public Procurementrefund(Integer id){
        this.id = id;
    }

    public Procurementrefund(Integer id, String code, BigDecimal amount){
        this.id = id;
        this.code = code;
        this.amount = amount;
    }

}