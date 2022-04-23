package bit.project.server.dao;

import bit.project.server.util.dto.BranchWiseBillPayment;
import org.springframework.data.domain.Page;
import bit.project.server.entity.Rentalpayment;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.time.LocalDate;
import java.util.List;

@RepositoryRestResource(exported=false)
public interface RentalpaymentDao extends JpaRepository<Rentalpayment, Integer>{
    @Query("select new Rentalpayment (r.id,r.code,r.amount) from Rentalpayment r")
    Page<Rentalpayment> findAllBasic(PageRequest pageRequest);

    Rentalpayment findByCode(String code);


    @Query("select sum (rp.amount) as amount, (select b.city from Branch b where b.id = rp.rental.branch.id) as branch  from Rentalpayment rp where rp.date >=:sdate and rp.date <=:edate  group by rp.rental.branch")
    List<BranchWiseBillPayment> totalPayments(@Param("sdate") LocalDate sdate, @Param("edate") LocalDate edate);

    @Query("select sum (bp.amount) as amount from Rentalpayment bp where bp.date <=:sdate and bp.date >=:edate")
    Integer getSumof30(@Param("sdate") LocalDate sdate, @Param("edate") LocalDate edate);

}
