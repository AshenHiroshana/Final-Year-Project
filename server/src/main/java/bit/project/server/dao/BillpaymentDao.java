package bit.project.server.dao;

import bit.project.server.util.dto.BranchWiseBillPayment;
import org.springframework.data.domain.Page;
import bit.project.server.entity.Billpayment;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.util.Date;
import java.util.List;

@RepositoryRestResource(exported=false)
public interface BillpaymentDao extends JpaRepository<Billpayment, Integer>{
    @Query("select new Billpayment (b.id,b.code,b.title,b.branch,b.amount,b.photo) from Billpayment b")
    Page<Billpayment> findAllBasic(PageRequest pageRequest);

//    @Query(value = "SELECT sum(bp.amount) as amount, (select b.city from branch b where b.id = bp.branch_id) as branch FROM billpayment bp group by branch_id;", nativeQuery = true)
//    List<BranchWiseBillPayment> totalPayments();

    @Query("select sum (bp.amount) as amount, (select b.city from Branch b where b.id = bp.branch.id) as branch  from Billpayment bp where bp.date >=:sdate and bp.date <=:edate  group by bp.branch")
    List<BranchWiseBillPayment> totalPayments(@Param("sdate") LocalDate sdate, @Param("edate") LocalDate edate);

    @Query("select sum (bp.amount) as amount from Billpayment bp where bp.date <=:sdate and bp.date >=:edate")
    Integer getSumof30(@Param("sdate") LocalDate sdate, @Param("edate") LocalDate edate);


    Billpayment findByCode(String code);
}
