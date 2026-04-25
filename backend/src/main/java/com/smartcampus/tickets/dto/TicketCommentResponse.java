package com.smartcampus.tickets.dto;

import com.smartcampus.tickets.model.TicketComment;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TicketCommentResponse {
    
    private Long id;
    private Long ticketId;
    private Long userId;
    private String comment;
    private LocalDateTime createdAt;
    private Boolean canEdit;
    private Boolean canDelete;
    
    public static TicketCommentResponse from(TicketComment ticketComment, Long currentUserId) {
        TicketCommentResponse response = new TicketCommentResponse();
        response.setId(ticketComment.getId());
        response.setTicketId(ticketComment.getTicket().getId());
        response.setUserId(ticketComment.getUserId());
        response.setComment(ticketComment.getComment());
        response.setCreatedAt(ticketComment.getCreatedAt());
        response.setCanEdit(ticketComment.canEdit(currentUserId));
        response.setCanDelete(ticketComment.canDelete(currentUserId));
        return response;
    }
}
