package com.smartcampus.technicians.repository;

import com.smartcampus.technicians.model.Technician;
import com.smartcampus.technicians.model.Technician.TechnicianStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TechnicianRepository extends JpaRepository<Technician, Long> {
    
    List<Technician> findByStatus(TechnicianStatus status);
    
    Optional<Technician> findByEmail(String email);
    
    List<Technician> findByDepartment(String department);
    
    List<Technician> findBySpecialization(String specialization);
    
    @Query("SELECT t FROM Technician t WHERE t.status = :status ORDER BY t.name")
    List<Technician> findActiveTechnicians(@Param("status") TechnicianStatus status);
    
    @Query("SELECT COUNT(t) FROM Technician t WHERE t.status = :status")
    long countByStatus(@Param("status") TechnicianStatus status);
}
