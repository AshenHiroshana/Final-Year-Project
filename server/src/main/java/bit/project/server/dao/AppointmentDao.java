package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Appointment;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface AppointmentDao extends JpaRepository<Appointment, Integer>{
    @Query("select new Appointment (a.id,a.code,a.employee) from Appointment a")
    Page<Appointment> findAllBasic(PageRequest pageRequest);

    Appointment findByCode(String code);
}