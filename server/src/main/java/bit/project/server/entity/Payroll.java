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
public class Payroll{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private BigDecimal basicsalary;

    private BigDecimal epfamount;

    private BigDecimal netsalary;

    private BigDecimal alowances;

    private LocalDate paydate;

    private String bankaccountno;

    private String bankname;

    private String bankbranch;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Employee employee;

    @ManyToOne
    private Appointment appointment;

    @OneToMany(mappedBy="payroll", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Payrolladdition> payrolladditionList;

    @OneToMany(mappedBy="payroll", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Payrolldeduction> payrolldeductionList;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    public Payroll(Integer id){
        this.id = id;
    }

    public Payroll(Integer id, String code, Employee employee, BigDecimal basicsalary, BigDecimal epfamount, BigDecimal netsalary){
        this.id = id;
        this.code = code;
        this.employee = employee;
        this.basicsalary = basicsalary;
        this.epfamount = epfamount;
        this.netsalary = netsalary;
    }

}
