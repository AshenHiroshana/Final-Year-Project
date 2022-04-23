package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Servicetype;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface ServicetypeDao extends JpaRepository<Servicetype, Integer>{
    @Query("select new Servicetype (s.id,s.code,s.name) from Servicetype s")
    Page<Servicetype> findAllBasic(PageRequest pageRequest);

    Servicetype findByCode(String code);
}