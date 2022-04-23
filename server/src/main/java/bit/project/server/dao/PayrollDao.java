package bit.project.server.dao;

import bit.project.server.entity.Employee;
import bit.project.server.entity.Payroll;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported=false)
public interface PayrollDao extends JpaRepository<Payroll, Integer>{
    @Query("select new Payroll (p.id,p.code,p.employee,p.basicsalary,p.epfamount,p.netsalary) from Payroll p")
    Page<Payroll> findAllBasic(PageRequest pageRequest);

    List<Payroll> findAllByEmployee(Employee employee);

    Payroll findByCode(String code);
}
