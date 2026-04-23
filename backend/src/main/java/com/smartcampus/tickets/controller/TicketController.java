package com.smartcampus.tickets.controller;

import com.smartcampus.tickets.dto.*;
import com.smartcampus.tickets.model.Ticket;
import com.smartcampus.tickets.model.TicketAttachment;
import com.smartcampus.tickets.model.TechnicianAssignment;
import com.smartcampus.tickets.service.TicketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
@Slf4j
@Validated
@CrossOrigin(origins = "http://localhost:3000")
public class TicketController {
    
    private final TicketService ticketService;
    
    @PostMapping
    public ResponseEntity<TicketResponse> createTicket(@Valid @RequestBody TicketCreateRequest request) {
        log.info("Creating ticket request from user: {}", request.getUserId());
        TicketResponse response = ticketService.createTicket(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{ticketId}")
    public ResponseEntity<TicketResponse> getTicket(@PathVariable Long ticketId) {
        log.info("Fetching ticket: {}", ticketId);
        TicketResponse response = ticketService.getTicket(ticketId);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{ticketId}")
    public ResponseEntity<TicketResponse> updateTicket(@PathVariable Long ticketId,
                                                      @Valid @RequestBody TicketUpdateRequest request) {
        log.info("Updating ticket: {}", ticketId);
        TicketResponse response = ticketService.updateTicket(ticketId, request);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{ticketId}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long ticketId) {
        log.info("Deleting ticket: {}", ticketId);
        ticketService.deleteTicket(ticketId);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TicketResponse>> getTicketsByUser(@PathVariable Long userId) {
        log.info("Fetching tickets for user: {}", userId);
        List<TicketResponse> tickets = ticketService.getTicketsByUser(userId);
        return ResponseEntity.ok(tickets);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<TicketResponse>> getTicketsByStatus(@PathVariable Ticket.TicketStatus status) {
        log.info("Fetching tickets with status: {}", status);
        List<TicketResponse> tickets = ticketService.getTicketsByStatus(status);
        return ResponseEntity.ok(tickets);
    }
    
        
        
    @PostMapping("/{ticketId}/comments")
    public ResponseEntity<TicketCommentResponse> addComment(@PathVariable Long ticketId,
                                                           @Valid @RequestBody TicketCommentRequest request) {
        log.info("Adding comment to ticket: {}", ticketId);
        TicketCommentResponse response = ticketService.addComment(ticketId, request);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<TicketCommentResponse> updateComment(@PathVariable Long commentId,
                                                             @RequestParam String comment,
                                                             @RequestParam Long userId) {
        log.info("Updating comment: {}", commentId);
        TicketCommentResponse response = ticketService.updateComment(commentId, comment, userId);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId,
                                             @RequestParam Long userId) {
        log.info("Deleting comment: {}", commentId);
        ticketService.deleteComment(commentId, userId);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{ticketId}/assign")
    public ResponseEntity<TechnicianAssignmentResponse> assignTechnician(@PathVariable Long ticketId,
                                                                         @Valid @RequestBody TechnicianAssignmentRequest request) {
        log.info("Assigning technician to ticket: {}", ticketId);
        TechnicianAssignmentResponse response = ticketService.assignTechnician(ticketId, request);
        return ResponseEntity.ok(response);
    }
    
        
    @GetMapping("/categories")
    public ResponseEntity<Ticket.TicketCategory[]> getCategories() {
        return ResponseEntity.ok(Ticket.TicketCategory.values());
    }
    
    @GetMapping("/priorities")
    public ResponseEntity<Ticket.TicketPriority[]> getPriorities() {
        return ResponseEntity.ok(Ticket.TicketPriority.values());
    }
    
    @GetMapping("/statuses")
    public ResponseEntity<Ticket.TicketStatus[]> getStatuses() {
        return ResponseEntity.ok(Ticket.TicketStatus.values());
    }
}
