package bit.project.server.dao;

import bit.project.server.entity.Vendor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface VendorDao extends JpaRepository<Vendor, Integer>{
    @Query("select new Vendor (v.id,v.code,v.name,v.primarycontact) from Vendor v")
    Page<Vendor> findAllBasic(PageRequest pageRequest);

    Vendor findByCode(String code);
    Vendor findByEmail(String email);
    Vendor findByPrimarycontact(String primarycontact);
    Vendor findByFax(String fax);
}