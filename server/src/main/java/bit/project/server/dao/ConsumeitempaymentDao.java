package bit.project.server.dao;

import bit.project.server.entity.Procurementitempurchase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import bit.project.server.entity.Consumeitempayment;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.time.LocalDate;
import java.util.List;

@RepositoryRestResource(exported=false)
public interface ConsumeitempaymentDao extends JpaRepository<Consumeitempayment, Integer>{
    @Query("select new Consumeitempayment (c.id,c.code,c.amount) from Consumeitempayment c")
    Page<Consumeitempayment> findAllBasic(PageRequest pageRequest);

        @Query("select count(c) from Consumeitempayment c where c.date>=:startdate and c.date<=:enddate")
    Long getConsumeitempaymentCountByRange(@Param("startdate") LocalDate startdate, @Param("enddate")LocalDate enddate);

    @Query("select sum (bp.amount) as amount from Consumeitempayment bp where bp.date <=:sdate and bp.date >=:edate")
    Integer getSumof30(@Param("sdate") LocalDate sdate, @Param("edate") LocalDate edate);

    Consumeitempayment findByCode(String code);
}
