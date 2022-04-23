package bit.project.server.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import bit.project.server.entity.Procurementpayment;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface ProcurementpaymentDao extends JpaRepository<Procurementpayment, Integer>{
    @Query("select new Procurementpayment (p.id,p.code,p.amount) from Procurementpayment p")
    Page<Procurementpayment> findAllBasic(PageRequest pageRequest);

    Procurementpayment findByCode(String code);
}