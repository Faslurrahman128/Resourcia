package com.smartcampus.technicians.repository;

import com.smartcampus.technicians.model.TicketAssignment;
import com.smartcampus.technicians.model.TicketAssignment.AssignmentStatus;
import com.smartcampus.tickets.model.Ticket;
import com.smartcampus.technicians.model.Technician;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketAssignmentRepository extends JpaRepository<TicketAssignment, Long> {
    
    Optional<TicketAssignment> findByTicketId(Long ticketId);
    
    List<TicketAssignment> findByTechnicianId(Long technicianId);
    
    List<TicketAssignment> findByAssignmentStatus(AssignmentStatus status);
    
    List<TicketAssignment> findByTechnicianIdAndAssignmentStatus(Long technicianId, AssignmentStatus status);
    
    @Query("SELECT ta FROM TicketAssignment ta WHERE ta.technicianId = :technicianId ORDER BY ta.assignedAt DESC")
    List<TicketAssignment> findAssignmentsByTechnicianId(@Param("technicianId") Long technicianId);
    
    @Query("SELECT COUNT(ta) FROM TicketAssignment ta WHERE ta.technicianId = :technicianId AND ta.assignmentStatus = :status")
    long countByTechnicianIdAndStatus(@Param("technicianId") Long technicianId, @Param("status") AssignmentStatus status);
    
    void deleteByTicketId(Long ticketId);
}
