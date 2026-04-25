package com.smartcampus.tickets.dto;

import com.smartcampus.tickets.model.Ticket;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TicketResponse {
    
    private Long id;
    private Long userId;
    private String resourceId;
    private Ticket.TicketCategory category;
    private String title;
    private String description;
    private Ticket.TicketPriority priority;
    private String contactDetails;
    private Ticket.TicketStatus status;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private List<TicketAttachmentResponse> attachments;
    private List<TicketCommentResponse> comments;
    private TechnicianAssignmentResponse assignment;
    
    public static TicketResponse from(Ticket ticket) {
        try {
            TicketResponse response = new TicketResponse();
            response.setId(ticket.getId());
            response.setUserId(ticket.getUserId());
            response.setResourceId(ticket.getResourceId());
            response.setCategory(ticket.getCategory());
            response.setTitle(ticket.getTitle());
            response.setDescription(ticket.getDescription());
            response.setPriority(ticket.getPriority());
            response.setContactDetails(ticket.getContactDetails());
            response.setStatus(ticket.getStatus());
            response.setRejectionReason(ticket.getRejectionReason());
            response.setCreatedAt(ticket.getCreatedAt());
            return response;
        } catch (Exception e) {
            // Log the error and return a basic response
            TicketResponse response = new TicketResponse();
            response.setId(ticket.getId());
            response.setUserId(ticket.getUserId());
            response.setCategory(ticket.getCategory());
            response.setTitle(ticket.getTitle());
            response.setDescription(ticket.getDescription());
            response.setPriority(ticket.getPriority());
            response.setStatus(ticket.getStatus());
            response.setCreatedAt(ticket.getCreatedAt());
            return response;
        }
    }
}
