package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Procurementitem;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface ProcurementitemDao extends JpaRepository<Procurementitem, Integer>{
    @Query("select new Procurementitem (p.id,p.code,p.procurementitemtype,p.procurementitemstatus) from Procurementitem p")
    Page<Procurementitem> findAllBasic(PageRequest pageRequest);

    Procurementitem findByCode(String code);
}