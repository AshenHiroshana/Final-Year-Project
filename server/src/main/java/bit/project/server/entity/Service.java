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
public class Service{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private LocalDate sdate;

    private String title;

    private BigDecimal total;

    private BigDecimal balance;

    private LocalDate edate;

    private String invoice;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Branch branch;

    @ManyToOne
    private Vendor vendor;

    @ManyToOne
    private Servicetype servicetype;

    @OneToMany(mappedBy="service", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Serviceprocurementitem> serviceprocurementitemList;

    @ManyToOne
    private Servicestatus servicestatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "service")
    private List<Servicepayment> serviceServicepaymentList;

    @JsonIgnore
    @OneToMany(mappedBy = "service")
    private List<Servicerefund> serviceServicerefundList;


    public Service(Integer id){
        this.id = id;
    }

    public Service(Integer id, String code, String title, Vendor vendor, BigDecimal total, BigDecimal balance){
        this.id = id;
        this.code = code;
        this.title = title;
        this.vendor = vendor;
        this.balance = balance;
        this.total = total;
    }

}
