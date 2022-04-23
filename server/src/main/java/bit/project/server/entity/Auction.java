package bit.project.server.entity;

import lombok.Data;
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
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Auction{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String buyer;

    private BigDecimal amount;

    private LocalDate date;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Procurementitem procurementitem;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    public Auction(Integer id){
        this.id = id;
    }

    public Auction(Integer id, String code, String buyer, BigDecimal amount){
        this.id = id;
        this.code = code;
        this.buyer = buyer;
        this.amount = amount;
    }

}