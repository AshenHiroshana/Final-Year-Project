package bit.project.server.dao;

import bit.project.server.entity.Print;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface PrintDao extends JpaRepository<Print, Integer>{
    @Query("select new Print (p.id,p.code,p.printorder) from Print p")
    Page<Print> findAllBasic(PageRequest pageRequest);

    Print findByCode(String code);
}