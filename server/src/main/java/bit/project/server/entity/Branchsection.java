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
public class Branchsection{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String name;

    private String photo;

    private String areaplan;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Branchsectionstatus branchsectionstatus;

    @ManyToOne
    private Branchsectiontype branchsectiontype;

    @ManyToOne
    private Branch branch;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "branchsection")
    private List<Procurementallocation> branchsectionProcurementallocationList;


    public Branchsection(Integer id){
        this.id = id;
    }

    public Branchsection(Integer id, String code, String name){
        this.id = id;
        this.code = code;
        this.name = name;
    }

}