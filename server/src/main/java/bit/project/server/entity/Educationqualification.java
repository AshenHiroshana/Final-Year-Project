package bit.project.server.entity;

import lombok.Data;
import javax.persistence.*;
import javax.persistence.Id;
import javax.persistence.Lob;
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
public class Educationqualification{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String title;

    @Lob
    private String description;

    private String file;


    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    private Employee employee;


    public Educationqualification(Integer id){
        this.id = id;
    }

}