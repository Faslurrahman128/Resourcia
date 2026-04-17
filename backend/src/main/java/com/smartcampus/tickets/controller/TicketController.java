package com.smartcampus.tickets.controller;

import com.smartcampus.tickets.dto.TicketCreateRequest;
import com.smartcampus.tickets.dto.TicketResponse;
import com.smartcampus.tickets.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {
    private final TicketService ticketService;

    @PostMapping
    public ResponseEntity<TicketResponse> createTicket(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestBody TicketCreateRequest request) {
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        TicketResponse response = ticketService.createTicket(userId, request);
        if (response == null) {
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<TicketResponse>> getTickets(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long technicianId) {
        return ResponseEntity.ok(ticketService.getTickets(status, technicianId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TicketResponse> updateTicketStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String reason) {
        TicketResponse response = ticketService.updateTicketStatus(id, status, reason);
        if (response == null) {
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
        }
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }
}
