package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import javax.persistence.Id;
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
public class Consumeitem{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String name;

    private Integer qty;

    private String photo;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Consumeitemcategory consumeitemcategory;

    @ManyToOne
    private Unit unit;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "consumeitem")
    private List<Consumedistributionitem> consumedistributionitemList;

    @JsonIgnore
    @OneToMany(mappedBy = "consumeitem")
    private List<Consumeitempurchaseconsumeitem> consumeitempurchaseconsumeitemList;


    @ManyToMany
        @JoinTable(
        name="consumeitemvendor",
        joinColumns=@JoinColumn(name="consumeitem_id", referencedColumnName="id"),
        inverseJoinColumns=@JoinColumn(name="vendor_id", referencedColumnName="id")
    )
    private List<Vendor> vendorList;


    public Consumeitem(Integer id){
        this.id = id;
    }

    public Consumeitem(Integer id, String code, Consumeitemcategory consumeitemcategory, String name){
        this.id = id;
        this.code = code;
        this.consumeitemcategory = consumeitemcategory;
        this.name = name;
    }

}