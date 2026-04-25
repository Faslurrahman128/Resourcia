package com.smartcampus.tickets.dto;

import com.smartcampus.tickets.model.TicketAttachment;
import lombok.Data;

@Data
public class TicketAttachmentResponse {
    
    private Long id;
    private String imageUrl;
    
    public static TicketAttachmentResponse from(TicketAttachment attachment) {
        TicketAttachmentResponse response = new TicketAttachmentResponse();
        response.setId(attachment.getId());
        response.setImageUrl(attachment.getImageUrl());
        return response;
    }
}
