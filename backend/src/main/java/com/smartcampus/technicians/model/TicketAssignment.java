package com.smartcampus.technicians.model;

import com.smartcampus.tickets.model.Ticket;
import lombok.Builder;
import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ticket_assignments")
@Data
@Builder
public class TicketAssignment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "ticket_id", nullable = false)
    private Long ticketId;
    
    @Column(name = "technician_id", nullable = false)
    private Long technicianId;
    
    @Column(name = "assigned_at", nullable = false)
    private LocalDateTime assignedAt;
    
    @Column(name = "assigned_by")
    private Long assignedBy;
    
    @Column(name = "notes")
    private String notes;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "assignment_status", nullable = false)
    private AssignmentStatus assignmentStatus;
    
    public enum AssignmentStatus {
        ASSIGNED, IN_PROGRESS, COMPLETED, REJECTED
    }
    
    @PrePersist
    protected void onCreate() {
        assignedAt = LocalDateTime.now();
        if (assignmentStatus == null) {
            assignmentStatus = AssignmentStatus.ASSIGNED;
        }
    }
    
    // Getters and setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getTicketId() {
        return ticketId;
    }
    
    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }
    
    public Long getTechnicianId() {
        return technicianId;
    }
    
    public void setTechnicianId(Long technicianId) {
        this.technicianId = technicianId;
    }
    
    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }
    
    public void setAssignedAt(LocalDateTime assignedAt) {
        this.assignedAt = assignedAt;
    }
    
    public Long getAssignedBy() {
        return assignedBy;
    }
    
    public void setAssignedBy(Long assignedBy) {
        this.assignedBy = assignedBy;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public AssignmentStatus getAssignmentStatus() {
        return assignmentStatus;
    }
    
    public void setAssignmentStatus(AssignmentStatus assignmentStatus) {
        this.assignmentStatus = assignmentStatus;
    }
}
