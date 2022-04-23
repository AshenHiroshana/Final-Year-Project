package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import java.time.LocalDate;
import javax.persistence.Id;
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
public class Printorder{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private Integer qty;

    private LocalDate ordereddate;

    private LocalDate requireddate;

    private LocalDate receiveddate;

    private LocalDateTime tocreation;


    @ManyToOne
    private Branch branch;

    @ManyToOne
    private Material material;

    @ManyToOne
    private Printorderstatus printorderstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "printorder")
    private List<Print> printorderPrintList;


    public Printorder(Integer id){
        this.id = id;
    }

    public Printorder(Integer id, String code, Branch branch, Material material, Printorderstatus printorderstatus){
        this.id = id;
        this.code = code;
        this.branch = branch;
        this.material = material;
        this.printorderstatus = printorderstatus;
    }

}
