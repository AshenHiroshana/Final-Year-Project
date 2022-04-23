package bit.project.server.dao;

import bit.project.server.entity.Printorder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported=false)
public interface PrintorderDao extends JpaRepository<Printorder, Integer>{
    @Query("select new Printorder (p.id,p.code,p.branch,p.material, p.printorderstatus) from Printorder p")
    Page<Printorder> findAllBasic(PageRequest pageRequest);

    @Query("select new Printorder (p.id,p.code,p.branch,p.material, p.printorderstatus) from Printorder p")
    List<Printorder> findAllForDashbord();


    Printorder findByCode(String code);
}
