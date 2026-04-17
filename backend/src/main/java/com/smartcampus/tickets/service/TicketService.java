package com.smartcampus.tickets.service;

import com.smartcampus.tickets.dto.TicketCreateRequest;
import com.smartcampus.tickets.dto.TicketResponse;
import java.util.List;

public interface TicketService {
    TicketResponse createTicket(Long userId, TicketCreateRequest request);

    List<TicketResponse> getTickets(String status, Long technicianId);

    TicketResponse updateTicketStatus(Long ticketId, String status, String reason);

    void deleteTicket(Long ticketId);
}
