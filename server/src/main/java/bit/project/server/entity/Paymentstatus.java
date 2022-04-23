package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import javax.persistence.Id;
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
public class Paymentstatus{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String name;


    @JsonIgnore
    @OneToMany(mappedBy = "paymentstatus")
    private List<Consumeitempayment> paymentstatusConsumeitempaymentList;

    @JsonIgnore
    @OneToMany(mappedBy = "paymentstatus")
    private List<Procurementpayment> paymentstatusProcurementpaymentList;

    @JsonIgnore
    @OneToMany(mappedBy = "paymentstatus")
    private List<Procurementrefund> paymentstatusProcurementrefundList;

    @JsonIgnore
    @OneToMany(mappedBy = "paymentstatus")
    private List<Rentalpayment> paymentstatusRentalpaymentList;

    @JsonIgnore
    @OneToMany(mappedBy = "paymentstatus")
    private List<Servicepayment> paymentstatusServicepaymentList;

    @JsonIgnore
    @OneToMany(mappedBy = "paymentstatus")
    private List<Servicerefund> paymentstatusServicerefundList;


    public Paymentstatus(Integer id){
        this.id = id;
    }

}