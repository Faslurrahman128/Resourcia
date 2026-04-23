package com.smartcampus.tickets.dto;

import com.smartcampus.tickets.model.Ticket;
import lombok.Data;

@Data
public class TicketUpdateRequest {
    
    private Long userId;
    private Long resourceId;
    private Ticket.TicketCategory category;
    private String description;
    private Ticket.TicketPriority priority;
    private String contactDetails;
    private Ticket.TicketStatus status;
    private String rejectionReason;
}
