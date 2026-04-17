package com.smartcampus.tickets.service;

import com.smartcampus.tickets.dto.TicketCreateRequest;
import com.smartcampus.tickets.dto.TicketResponse;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.List;

@Service
public class TicketServiceImpl implements TicketService {
    @Override
    public TicketResponse createTicket(Long userId, TicketCreateRequest request) {
        return null;
    }

    @Override
    public List<TicketResponse> getTickets(String status, Long technicianId) {
        return Collections.emptyList();
    }

    @Override
    public TicketResponse updateTicketStatus(Long ticketId, String status, String reason) {
        return null;
    }

    @Override
    public void deleteTicket(Long ticketId) {
        // TODO: Implement delete ticket logic.
    }
}
