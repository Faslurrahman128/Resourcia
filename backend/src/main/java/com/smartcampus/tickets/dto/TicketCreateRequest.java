package com.smartcampus.tickets.dto;

import com.smartcampus.tickets.model.Ticket;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class TicketCreateRequest {
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    private Long resourceId;
    
    @NotNull(message = "Category is required")
    private Ticket.TicketCategory category;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotNull(message = "Priority is required")
    private Ticket.TicketPriority priority;
    
    private String contactDetails;
}
