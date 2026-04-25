package com.smartcampus.technicians.dto;

import com.smartcampus.technicians.model.TicketAssignment;
import com.smartcampus.tickets.dto.TicketResponse;
import com.smartcampus.technicians.dto.TechnicianResponse;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TicketAssignmentResponse {
    
    private Long id;
    private TicketResponse ticket;
    private TechnicianResponse technician;
    private LocalDateTime assignedAt;
    private Long assignedBy;
    private String notes;
    private TicketAssignment.AssignmentStatus assignmentStatus;
    
    public static TicketAssignmentResponse from(TicketAssignment assignment) {
        TicketAssignmentResponse response = new TicketAssignmentResponse();
        response.setId(assignment.getId());
        // Note: Ticket and Technician will need to be fetched separately due to simplified entity
        response.setAssignedAt(assignment.getAssignedAt());
        response.setAssignedBy(assignment.getAssignedBy());
        response.setNotes(assignment.getNotes());
        response.setAssignmentStatus(assignment.getAssignmentStatus());
        return response;
    }
}
