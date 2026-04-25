package com.smartcampus.tickets.repository;

import com.smartcampus.tickets.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    
    List<Ticket> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<Ticket> findByStatusOrderByCreatedAtDesc(Ticket.TicketStatus status);
    
    List<Ticket> findByCategoryOrderByCreatedAtDesc(Ticket.TicketCategory category);
    
    List<Ticket> findByPriorityOrderByCreatedAtDesc(Ticket.TicketPriority priority);
    
    List<Ticket> findByResourceIdOrderByCreatedAtDesc(Long resourceId);
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.status = :status")
    Long countByStatus(@Param("status") Ticket.TicketStatus status);
}
