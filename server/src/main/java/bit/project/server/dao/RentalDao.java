package bit.project.server.dao;

import bit.project.server.entity.Rental;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface RentalDao extends JpaRepository<Rental, Integer>{
    @Query("select new Rental (r.id,r.code,r.branch,r.name) from Rental r")
    Page<Rental> findAllBasic(PageRequest pageRequest);

    Rental findByCode(String code);
}