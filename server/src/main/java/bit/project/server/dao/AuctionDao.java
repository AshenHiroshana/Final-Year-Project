package bit.project.server.dao;

import bit.project.server.entity.Auction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface AuctionDao extends JpaRepository<Auction, Integer>{
    @Query("select new Auction (a.id,a.code,a.buyer,a.amount) from Auction a")
    Page<Auction> findAllBasic(PageRequest pageRequest);

    Auction findByCode(String code);
}