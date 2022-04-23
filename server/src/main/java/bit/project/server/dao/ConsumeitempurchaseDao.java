package bit.project.server.dao;

import bit.project.server.entity.Procurementitempurchase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import bit.project.server.entity.Consumeitempurchase;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported=false)
public interface ConsumeitempurchaseDao extends JpaRepository<Consumeitempurchase, Integer>{
    @Query("select new Consumeitempurchase (c.id,c.code,c.vendor,c.total,c.balance) from Consumeitempurchase c")
    Page<Consumeitempurchase> findAllBasic(PageRequest pageRequest);

    @Query("select new Consumeitempurchase (c.id,c.code,c.vendor,c.total,c.balance) from Consumeitempurchase c where c.balance <> 0")
    List<Consumeitempurchase> findAllNonePayed();

    Consumeitempurchase findByCode(String code);
}
