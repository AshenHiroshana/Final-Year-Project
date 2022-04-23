package bit.project.server.dao;

import bit.project.server.entity.Attendance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported=false)
public interface AttendanceDao extends JpaRepository<Attendance, Integer>{
    @Query("select new Attendance (a.id,a.code,a.employee,a.date) from Attendance a")
    Page<Attendance> findAllBasic(PageRequest pageRequest);

    @Query("select a from Attendance a where a.employee.id =:id")
    List<Attendance> findAllByEmployee(@Param("id") Integer id);

    Attendance findByCode(String code);
}
