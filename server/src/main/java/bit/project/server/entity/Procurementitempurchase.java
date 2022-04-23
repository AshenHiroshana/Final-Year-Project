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
public class Procurementitempurchase{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private LocalDate date;

    private BigDecimal total;

    private BigDecimal balance;

    private String invoice;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Vendor vendor;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "procurementitempurchase")
    private List<Procurementitem> procurementitempurchaseProcurementitemList;

    @JsonIgnore
    @OneToMany(mappedBy = "procurementitempurchase")
    private List<Procurementpayment> procurementitempurchaseProcurementpaymentList;

    @JsonIgnore
    @OneToMany(mappedBy = "procurementitempurchase")
    private List<Procurementrefund> procurementitempurchaseProcurementrefundList;


    public Procurementitempurchase(Integer id){
        this.id = id;
    }

    public Procurementitempurchase(Integer id, String code, Vendor vendor, BigDecimal total, BigDecimal balance){
        this.id = id;
        this.code = code;
        this.vendor = vendor;
        this.total = total;
        this.balance = balance;
    }

}
