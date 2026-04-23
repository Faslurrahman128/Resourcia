package com.smartcampus.tickets.dto;

import com.smartcampus.tickets.model.TechnicianAssignment;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TechnicianAssignmentResponse {
    
    private Long id;
    private Long ticketId;
    private Long technicianId;
    private LocalDateTime assignedAt;
    private String resolutionNotes;
    
    public static TechnicianAssignmentResponse from(TechnicianAssignment assignment) {
        TechnicianAssignmentResponse response = new TechnicianAssignmentResponse();
        response.setId(assignment.getId());
        response.setTicketId(assignment.getTicket().getId());
        response.setTechnicianId(assignment.getTechnicianId());
        response.setAssignedAt(assignment.getAssignedAt());
        response.setResolutionNotes(assignment.getResolutionNotes());
        return response;
    }
}
