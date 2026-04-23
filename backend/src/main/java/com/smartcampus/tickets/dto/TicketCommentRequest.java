package com.smartcampus.tickets.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class TicketCommentRequest {
    
    @NotBlank(message = "Comment is required")
    private String comment;
    
    @NotNull(message = "User ID is required")
    private Long userId;
}
