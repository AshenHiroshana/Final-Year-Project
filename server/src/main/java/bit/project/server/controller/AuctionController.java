package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import bit.project.server.entity.Auction;
import bit.project.server.dao.AuctionDao;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import org.springframework.data.domain.PageRequest;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.util.validation.EntityValidator;
import bit.project.server.util.exception.ConflictException;
import bit.project.server.util.validation.ValidationErrorBag;
import bit.project.server.util.security.AccessControlManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import bit.project.server.util.exception.DataValidationException;
import bit.project.server.util.exception.ObjectNotFoundException;

@CrossOrigin
@RestController
@RequestMapping("/auctions")
public class AuctionController{

    @Autowired
    private AuctionDao auctionDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public AuctionController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("auction");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("AU");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Auction> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all auctions", UsecaseList.SHOW_ALL_AUCTIONS);

        if(pageQuery.isEmptySearch()){
            return auctionDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        String buyer = pageQuery.getSearchParam("buyer");

        List<Auction> auctions = auctionDao.findAll(DEFAULT_SORT);
        Stream<Auction> stream = auctions.parallelStream();

        List<Auction> filteredAuctions = stream.filter(auction -> {
            if(code!=null)
                if(!auction.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(buyer!=null)
                if(!auction.getBuyer().toLowerCase().contains(buyer.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredAuctions, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Auction> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all auctions' basic data", UsecaseList.SHOW_ALL_AUCTIONS);
        return auctionDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Auction get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get auction", UsecaseList.SHOW_AUCTION_DETAILS);
        Optional<Auction> optionalAuction = auctionDao.findById(id);
        if(optionalAuction.isEmpty()) throw new ObjectNotFoundException("Auction not found");
        return optionalAuction.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete auctions", UsecaseList.DELETE_AUCTION);

        try{
            if(auctionDao.existsById(id)) auctionDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this auction already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Auction auction, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new auction", UsecaseList.ADD_AUCTION);

        auction.setTocreation(LocalDateTime.now());
        auction.setCreator(authUser);
        auction.setId(null);


        EntityValidator.validate(auction);

        PersistHelper.save(()->{
            auction.setCode(codeGenerator.getNextId(codeConfig));
            return auctionDao.save(auction);
        });

        return new ResourceLink(auction.getId(), "/auctions/"+auction.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Auction auction, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update auction details", UsecaseList.UPDATE_AUCTION);

        Optional<Auction> optionalAuction = auctionDao.findById(id);
        if(optionalAuction.isEmpty()) throw new ObjectNotFoundException("Auction not found");
        Auction oldAuction = optionalAuction.get();

        auction.setId(id);
        auction.setCode(oldAuction.getCode());
        auction.setCreator(oldAuction.getCreator());
        auction.setTocreation(oldAuction.getTocreation());


        EntityValidator.validate(auction);

        auction = auctionDao.save(auction);
        return new ResourceLink(auction.getId(), "/auctions/"+auction.getId());
    }

}