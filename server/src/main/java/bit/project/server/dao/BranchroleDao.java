package bit.project.server.dao;

import bit.project.server.entity.Branchrole;
import bit.project.server.entity.Branchroleassignment;
import bit.project.server.entity.File;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource(exported=false)
public interface BranchroleDao extends JpaRepository<Branchrole, Integer>{
    @Query("select new Branchrole (b.id,b.code,b.name,b.department) from Branchrole b")
    Page<Branchrole> findAllBasic(PageRequest pageRequest);


    @Query("select new Branchrole (b.id,b.code,b.name,b.department) from Branchrole b where b.branch.id =:id ")
    List<Branchrole> findAllByBranch(@Param("id") Integer id);

    Branchrole findByCode(String code);
}
