package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
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
public class Vendor{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String name;

    private String email;

    private String primarycontact;

    private String secondarycontact;

    private String fax;

    private BigDecimal starrate;

    @Lob
    private String address;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Vendortype vendortype;

    @ManyToOne
    private Vendorstatus vendorstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "vendor")
    private List<Consumeitempurchase> vendorConsumeitempurchaseList;

    @JsonIgnore
    @OneToMany(mappedBy = "vendor")
    private List<Procurementitem> vendorProcurementitemList;

    @JsonIgnore
    @OneToMany(mappedBy = "vendor")
    private List<Procurementitempurchase> vendorProcurementitempurchaseList;

    @JsonIgnore
    @OneToMany(mappedBy = "vendor")
    private List<Service> vendorServiceList;


    @JsonIgnore
    @ManyToMany(mappedBy = "vendorList")
    private List<Consumeitem> consumeitemList;

    @JsonIgnore
    @ManyToMany(mappedBy = "vendorList")
    private List<Procurementitemtype> procurementitemtypeList;

    @JsonIgnore
    @ManyToMany(mappedBy = "vendorList")
    private List<Servicetype> servicetypeList;


    public Vendor(Integer id){
        this.id = id;
    }

    public Vendor(Integer id, String code, String name, String primarycontact){
        this.id = id;
        this.code = code;
        this.name = name;
        this.primarycontact = primarycontact;
    }

}