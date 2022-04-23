package bit.project.server.dao;

import bit.project.server.entity.Material;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface MaterialDao extends JpaRepository<Material, Integer>{
    @Query("select new Material (m.id,m.code,m.name,m.file) from Material m")
    Page<Material> findAllBasic(PageRequest pageRequest);

    Material findByCode(String code);
}