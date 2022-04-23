package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Servicerefund;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface ServicerefundDao extends JpaRepository<Servicerefund, Integer>{
    @Query("select new Servicerefund (s.id,s.code,s.amount) from Servicerefund s")
    Page<Servicerefund> findAllBasic(PageRequest pageRequest);

    Servicerefund findByCode(String code);
}