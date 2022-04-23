package bit.project.server.controller;


import bit.project.server.UsecaseList;
import bit.project.server.dao.BillpaymentDao;
import bit.project.server.dao.ConsumeitempaymentDao;
import bit.project.server.dao.RentalpaymentDao;
import bit.project.server.entity.Consumeitempayment;
import bit.project.server.entity.Rentalpayment;
import bit.project.server.util.dto.BranchWiseBillPayment;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.security.AccessControlManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/reports")
public class ReportController {

    @Autowired
    ConsumeitempaymentDao consumeitempaymentDao;

    @Autowired
    BillpaymentDao billpaymentDao;

    @Autowired
    RentalpaymentDao rentalpaymentDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @GetMapping("/year-wise-consumeitempayment-count/{yearCount}")
    public ArrayList<HashMap<String, Object>> yearWiseConsumeitempaymentCount(@PathVariable Integer yearCount, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to show this report", UsecaseList.SHOW_PROCUREMENTITEMPURCHASE_DETAILS);
        ArrayList<HashMap<String, Object>> data = new ArrayList<>();

        ArrayList<LocalDate[]> years = new ArrayList<>();

        LocalDate[] currentYear = new LocalDate[2];
        currentYear[0] = LocalDate.parse(LocalDate.now().getYear()+"-01-01");
        currentYear[1] = LocalDate.parse(LocalDate.now().getYear()+"-12-31");
        years.add(currentYear);

        for (int i=0; i<yearCount-1; i++){
            LocalDate[] year = new LocalDate[2];
            LocalDate[] lastYear = years.get(years.size()-1);
            year[0] = lastYear[0].minusYears(1);
            year[1] = lastYear[1].minusYears(1);
            years.add(year);
        }

        for (LocalDate[] year : years){
            String y = String.valueOf(year[0].getYear());
            Long count = consumeitempaymentDao.getConsumeitempaymentCountByRange(year[0], year[1]);
            HashMap<String, Object> d = new HashMap<>();
            d.put("year", y);
            d.put("count", count);
            data.add(d);
        }

        return data;
    }

    @GetMapping("/branch-wise-bill-payment")
    public List<BranchWiseBillPayment> branchWiseBillPayment(PageQuery pageQuery){
        LocalDate startDate = LocalDate.parse(pageQuery.getSearchParam("startDate"));
        LocalDate endtDate = LocalDate.parse(pageQuery.getSearchParam("endtDate"));
        return billpaymentDao.totalPayments(startDate,endtDate);
    }

    @GetMapping("/branch-wise-rental-payment")
    public List<BranchWiseBillPayment> branchWiseRentalPayment(PageQuery pageQuery){
        LocalDate startDate = LocalDate.parse(pageQuery.getSearchParam("startDate"));
        LocalDate endtDate = LocalDate.parse(pageQuery.getSearchParam("endtDate"));
        System.out.println(pageQuery.getSearchParam("startDate"));
        System.out.println(pageQuery.getSearchParam("endtDate"));
        return rentalpaymentDao.totalPayments(startDate,endtDate);
    }

}
