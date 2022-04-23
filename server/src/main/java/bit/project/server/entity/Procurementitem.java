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
public class Procurementitem{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String itemphoto;

    private BigDecimal price;

    private LocalDate dopurchased;

    private String warrantyphoto;

    private String invoice;

    private LocalDate warrantyenddate;

    private Integer nooffreeservices;

    private String brand;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Vendor vendor;

    @ManyToOne
    private Procurementitemtype procurementitemtype;

    @ManyToOne
    private Procurementitempurchase procurementitempurchase;

    @ManyToOne
    private Buyingcondition buyingcondition;

    @ManyToOne
    private Procurementitemstatus procurementitemstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "procurementitem")
    private List<Auction> procurementitemAuctionList;

    @JsonIgnore
    @OneToMany(mappedBy = "procurementitem")
    private List<Procurementallocationprocurementitem> procurementallocationprocurementitemList;

    @JsonIgnore
    @OneToMany(mappedBy = "procurementitem")
    private List<Serviceprocurementitem> serviceprocurementitemList;


    @JsonIgnore
    @ManyToMany(mappedBy = "procurementitemList")
    private List<Procurementrefund> procurementrefundList;


    public Procurementitem(Integer id){
        this.id = id;
    }

    public Procurementitem(Integer id, String code, Procurementitemtype procurementitemtype, Procurementitemstatus procurementitemstatus){
        this.id = id;
        this.code = code;
        this.procurementitemtype = procurementitemtype;
        this.procurementitemstatus = procurementitemstatus;
    }

}