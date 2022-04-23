package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import java.time.LocalDate;
import javax.persistence.Id;
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
public class Procurementallocation{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private LocalDate doallocated;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Branchsection branchsection;

    @OneToMany(mappedBy="procurementallocation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Procurementallocationprocurementitem> procurementallocationprocurementitemList;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    public Procurementallocation(Integer id){
        this.id = id;
    }

    public Procurementallocation(Integer id, String code, Branchsection branchsection){
        this.id = id;
        this.code = code;
        this.branchsection = branchsection;
    }

}