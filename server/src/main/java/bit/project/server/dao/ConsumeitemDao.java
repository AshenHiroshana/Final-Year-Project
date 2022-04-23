package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Consumeitem;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface ConsumeitemDao extends JpaRepository<Consumeitem, Integer>{
    @Query("select new Consumeitem (c.id,c.code,c.consumeitemcategory,c.name) from Consumeitem c")
    Page<Consumeitem> findAllBasic(PageRequest pageRequest);


    Consumeitem findByCode(String code);
}
