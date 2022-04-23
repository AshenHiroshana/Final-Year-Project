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
public class Branch{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String city;

    private String primarycontact;

    private String secondarycontact;

    private String fax;

    private String photo;

    private String maplink;

    private String email;

    @Lob
    private String address;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Branchstatus branchstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "branch")
    private List<Attendance> branchAttendanceList;

    @JsonIgnore
    @OneToMany(mappedBy = "branch")
    private List<Billpayment> branchBillpaymentList;

    @OneToMany(mappedBy = "branch", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Branchbranchplan> branchbranchplanList;

    @JsonIgnore
    @OneToMany(mappedBy = "branch")
    private List<Branchrole> branchBranchroleList;

    @JsonIgnore
    @OneToMany(mappedBy = "branch")
    private List<Branchroleassignment> branchBranchroleassignmentList;

    @JsonIgnore
    @OneToMany(mappedBy = "branch")
    private List<Branchsection> branchBranchsectionList;

    @JsonIgnore
    @OneToMany(mappedBy = "branch")
    private List<Consumedistribution> branchConsumedistributionList;

    @JsonIgnore
    @OneToMany(mappedBy = "branch")
    private List<Printorder> branchPrintorderList;

    @JsonIgnore
    @OneToMany(mappedBy = "branch")
    private List<Rental> branchRentalList;

    @JsonIgnore
    @OneToMany(mappedBy = "branch")
    private List<Service> branchServiceList;


    @JsonIgnore
    @ManyToMany(mappedBy = "branchList")
    private List<Employee> employeeList;


    public Branch(Integer id){
        this.id = id;
    }

    public Branch(Integer id, String code, String city, String primarycontact){
        this.id = id;
        this.code = code;
        this.city = city;
        this.primarycontact = primarycontact;
    }

}