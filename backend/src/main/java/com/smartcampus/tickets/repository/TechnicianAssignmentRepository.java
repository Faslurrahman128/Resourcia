package com.smartcampus.tickets.repository;

import com.smartcampus.tickets.model.TechnicianAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TechnicianAssignmentRepository extends JpaRepository<TechnicianAssignment, Long> {
    
    Optional<TechnicianAssignment> findByTicketId(Long ticketId);
    
    List<TechnicianAssignment> findByTechnicianIdOrderByAssignedAtDesc(Long technicianId);
}
