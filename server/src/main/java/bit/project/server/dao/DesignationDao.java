package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Designation;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface DesignationDao extends JpaRepository<Designation, Integer>{
    @Query("select new Designation (d.id,d.code,d.name,d.department) from Designation d")
    Page<Designation> findAllBasic(PageRequest pageRequest);

    Designation findByCode(String code);
}