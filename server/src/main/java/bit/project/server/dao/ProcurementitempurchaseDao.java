package bit.project.server.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import bit.project.server.entity.Procurementitempurchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported=false)
public interface ProcurementitempurchaseDao extends JpaRepository<Procurementitempurchase, Integer>{
    @Query("select new Procurementitempurchase (p.id,p.code,p.vendor,p.total,p.balance) from Procurementitempurchase p")
    Page<Procurementitempurchase> findAllBasic(PageRequest pageRequest);

    @Query("select new Procurementitempurchase (p.id,p.code,p.vendor,p.total,p.balance) from Procurementitempurchase p where p.balance <> 0")
    List<Procurementitempurchase> findAllNonePayed();

    Procurementitempurchase findByCode(String code);
}
