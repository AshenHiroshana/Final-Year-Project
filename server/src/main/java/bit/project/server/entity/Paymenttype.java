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
public class Paymenttype{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String name;


    @JsonIgnore
    @OneToMany(mappedBy = "paymenttype")
    private List<Consumeitempayment> paymenttypeConsumeitempaymentList;

    @JsonIgnore
    @OneToMany(mappedBy = "paymenttype")
    private List<Procurementpayment> paymenttypeProcurementpaymentList;

    @JsonIgnore
    @OneToMany(mappedBy = "paymenttype")
    private List<Procurementrefund> paymenttypeProcurementrefundList;

    @JsonIgnore
    @OneToMany(mappedBy = "paymenttype")
    private List<Rentalpayment> paymenttypeRentalpaymentList;

    @JsonIgnore
    @OneToMany(mappedBy = "paymenttype")
    private List<Servicepayment> paymenttypeServicepaymentList;

    @JsonIgnore
    @OneToMany(mappedBy = "paymenttype")
    private List<Servicerefund> paymenttypeServicerefundList;


    public Paymenttype(Integer id){
        this.id = id;
    }

}