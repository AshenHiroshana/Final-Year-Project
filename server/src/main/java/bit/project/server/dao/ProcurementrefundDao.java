package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Procurementrefund;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface ProcurementrefundDao extends JpaRepository<Procurementrefund, Integer>{
    @Query("select new Procurementrefund (p.id,p.code,p.amount) from Procurementrefund p")
    Page<Procurementrefund> findAllBasic(PageRequest pageRequest);

    Procurementrefund findByCode(String code);
}