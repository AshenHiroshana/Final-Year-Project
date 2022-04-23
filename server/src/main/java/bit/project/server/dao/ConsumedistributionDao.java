package bit.project.server.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import bit.project.server.entity.Consumedistribution;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface ConsumedistributionDao extends JpaRepository<Consumedistribution, Integer>{
    @Query("select new Consumedistribution (c.id,c.code,c.branch) from Consumedistribution c")
    Page<Consumedistribution> findAllBasic(PageRequest pageRequest);

    Consumedistribution findByCode(String code);
}