package com.smartcampus.technicians.dto;

import com.smartcampus.technicians.model.TicketAssignment.AssignmentStatus;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class TicketAssignmentRequest {
    
    @NotNull(message = "Ticket ID is required")
    private Long ticketId;
    
    @NotNull(message = "Technician ID is required")
    private Long technicianId;
    
    private Long assignedBy;
    
    private String notes;
    
    private AssignmentStatus assignmentStatus;
}
