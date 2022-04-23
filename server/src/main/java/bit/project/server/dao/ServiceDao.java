package bit.project.server.dao;

import bit.project.server.entity.Procurementitempurchase;
import bit.project.server.entity.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported=false)
public interface ServiceDao extends JpaRepository<Service, Integer>{
    @Query("select new Service (s.id,s.code,s.title,s.vendor,s.total,s.balance) from Service s")
    Page<Service> findAllBasic(PageRequest pageRequest);

    Service findByCode(String code);

    @Query("select new Service (s.id,s.code,s.title,s.vendor,s.total,s.balance) from Service s where s.balance <> 0")
    List<Service> findAllNonePayed();

    @Query("select new Service (s.id,s.code,s.title,s.vendor,s.total,s.balance) from Service s where s.servicestatus.id = 1")
    List<Service> findAllInProgress();
}
