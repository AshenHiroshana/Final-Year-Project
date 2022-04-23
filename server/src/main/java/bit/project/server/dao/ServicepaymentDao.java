package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Servicepayment;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.time.LocalDate;

@RepositoryRestResource(exported=false)
public interface ServicepaymentDao extends JpaRepository<Servicepayment, Integer>{
    @Query("select new Servicepayment (s.id,s.code,s.amount) from Servicepayment s")
    Page<Servicepayment> findAllBasic(PageRequest pageRequest);

    @Query("select sum (bp.amount) as amount from Servicepayment bp where bp.date <=:sdate and bp.date >=:edate")
    Integer getSumof30(@Param("sdate") LocalDate sdate, @Param("edate") LocalDate edate);

    Servicepayment findByCode(String code);
}
