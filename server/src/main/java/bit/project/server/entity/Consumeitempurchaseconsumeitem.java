package bit.project.server.entity;

import lombok.Data;
import javax.persistence.*;
import javax.persistence.Id;
import java.math.BigDecimal;
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
public class Consumeitempurchaseconsumeitem{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private Integer qty;

    private BigDecimal unitprice;

    private BigDecimal linetotal;


    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    private Consumeitempurchase consumeitempurchase;

    @ManyToOne
    private Consumeitem consumeitem;


    public Consumeitempurchaseconsumeitem(Integer id){
        this.id = id;
    }

}