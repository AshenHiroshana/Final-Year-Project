package bit.project.server.dao;

import bit.project.server.entity.Branch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface BranchDao extends JpaRepository<Branch, Integer>{
    @Query("select new Branch (b.id,b.code,b.city,b.primarycontact) from Branch b")
    Page<Branch> findAllBasic(PageRequest pageRequest);

    Branch findByCode(String code);
    Branch findByPrimarycontact(String primarycontact);
    Branch findByFax(String fax);
    Branch findByEmail(String email);
}