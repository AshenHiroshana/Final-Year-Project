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
public class Procurementitemtype{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String name;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "procurementitemtype")
    private List<Procurementitem> procurementitemtypeProcurementitemList;


    @ManyToMany
        @JoinTable(
        name="procurementitemtypevendor",
        joinColumns=@JoinColumn(name="procurementitemtype_id", referencedColumnName="id"),
        inverseJoinColumns=@JoinColumn(name="vendor_id", referencedColumnName="id")
    )
    private List<Vendor> vendorList;


    public Procurementitemtype(Integer id){
        this.id = id;
    }

    public Procurementitemtype(Integer id, String code, String name){
        this.id = id;
        this.code = code;
        this.name = name;
    }

}