package bit.project.server.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import bit.project.server.entity.Procurementitemtype;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface ProcurementitemtypeDao extends JpaRepository<Procurementitemtype, Integer>{
    @Query("select new Procurementitemtype (p.id,p.code,p.name) from Procurementitemtype p")
    Page<Procurementitemtype> findAllBasic(PageRequest pageRequest);

    Procurementitemtype findByCode(String code);
}
