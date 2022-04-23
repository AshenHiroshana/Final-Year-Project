package bit.project.server.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import bit.project.server.entity.Procurementallocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface ProcurementallocationDao extends JpaRepository<Procurementallocation, Integer>{
    @Query("select new Procurementallocation (p.id,p.code,p.branchsection) from Procurementallocation p")
    Page<Procurementallocation> findAllBasic(PageRequest pageRequest);

    Procurementallocation findByCode(String code);
}