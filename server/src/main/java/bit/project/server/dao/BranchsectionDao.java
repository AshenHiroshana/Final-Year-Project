package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Branchsection;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported=false)
public interface BranchsectionDao extends JpaRepository<Branchsection, Integer>{
    @Query("select new Branchsection (b.id,b.code,b.name) from Branchsection b")
    Page<Branchsection> findAllBasic(PageRequest pageRequest);

    @Query("select new Branchsection (b.id,b.code,b.name) from Branchsection b where b.branch.id = :id")
    List<Branchsection> findAllByBranch(@Param("id") Integer id);

    Branchsection findByCode(String code);
}
