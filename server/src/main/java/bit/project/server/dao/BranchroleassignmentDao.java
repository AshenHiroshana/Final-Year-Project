package bit.project.server.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import bit.project.server.entity.Branchroleassignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported=false)
public interface BranchroleassignmentDao extends JpaRepository<Branchroleassignment, Integer>{
    @Query("select new Branchroleassignment (b.id,b.code,b.branch,b.branchrole) from Branchroleassignment b")
    Page<Branchroleassignment> findAllBasic(PageRequest pageRequest);




    Branchroleassignment findByCode(String code);
}
