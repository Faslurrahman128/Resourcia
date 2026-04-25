package com.smartcampus.tickets.service;

import com.smartcampus.tickets.dto.*;
import com.smartcampus.tickets.model.*;
import com.smartcampus.tickets.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TicketService {
    
    private final TicketRepository ticketRepository;
    private final TicketAttachmentRepository attachmentRepository;
    private final TicketCommentRepository commentRepository;
    private final TechnicianAssignmentRepository assignmentRepository;
    
    public TicketResponse createTicket(TicketCreateRequest request) {
        log.info("Creating ticket for user: {}", request.getUserId());
        
        Ticket ticket = Ticket.builder()
                .userId(request.getUserId())
                .resourceId(request.getResourceId())
                .category(request.getCategory())
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .contactDetails(request.getContactDetails())
                .status(Ticket.TicketStatus.OPEN)
                .build();
        
        Ticket savedTicket = ticketRepository.save(ticket);
        log.info("Created ticket with ID: {}", savedTicket.getId());
        
        return TicketResponse.from(savedTicket);
    }
    
    public TicketResponse updateTicket(Long ticketId, TicketUpdateRequest request) {
        log.info("Updating ticket: {}", ticketId);
        
        Ticket ticket = getTicketEntity(ticketId);
        
        if (request.getUserId() != null) {
            ticket.setUserId(request.getUserId());
        }
        if (request.getResourceId() != null) {
            ticket.setResourceId(request.getResourceId());
        }
        if (request.getCategory() != null) {
            ticket.setCategory(request.getCategory());
        }
        if (request.getDescription() != null) {
            ticket.setDescription(request.getDescription());
        }
        if (request.getPriority() != null) {
            ticket.setPriority(request.getPriority());
        }
        if (request.getContactDetails() != null) {
            ticket.setContactDetails(request.getContactDetails());
        }
        if (request.getStatus() != null) {
            validateStatusTransition(ticket.getStatus(), request.getStatus());
            ticket.setStatus(request.getStatus());
        }
        if (request.getRejectionReason() != null) {
            ticket.setRejectionReason(request.getRejectionReason());
        }
        
        Ticket savedTicket = ticketRepository.save(ticket);
        log.info("Updated ticket: {}", ticketId);
        
        return TicketResponse.from(savedTicket);
    }
    
    public TicketResponse getTicket(Long ticketId) {
        Ticket ticket = getTicketEntity(ticketId);
        return TicketResponse.from(ticket);
    }
    
    public List<TicketResponse> getTicketsByUser(Long userId) {
        return ticketRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(TicketResponse::from)
                .collect(Collectors.toList());
    }
    
    public List<TicketResponse> getTicketsByStatus(Ticket.TicketStatus status) {
        return ticketRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream()
                .map(TicketResponse::from)
                .collect(Collectors.toList());
    }
    
        
    public void deleteTicket(Long ticketId) {
        log.info("Deleting ticket: {}", ticketId);
        
        Ticket ticket = getTicketEntity(ticketId);
        
        if (ticket.getStatus() != Ticket.TicketStatus.CLOSED && 
            ticket.getStatus() != Ticket.TicketStatus.REJECTED) {
            throw new IllegalStateException("Only closed or rejected tickets can be deleted");
        }
        
        ticketRepository.delete(ticket);
        log.info("Deleted ticket: {}", ticketId);
    }
    
        
    public TicketCommentResponse addComment(Long ticketId, TicketCommentRequest request) {
        log.info("Adding comment to ticket: {}", ticketId);
        
        Ticket ticket = getTicketEntity(ticketId);
        
        TicketComment comment = TicketComment.builder()
                .ticket(ticket)
                .userId(request.getUserId())
                .comment(request.getComment())
                .build();
        
        TicketComment savedComment = commentRepository.save(comment);
        log.info("Added comment to ticket: {}", ticketId);
        
        return TicketCommentResponse.from(savedComment, request.getUserId());
    }
    
    public TicketCommentResponse updateComment(Long commentId, String newComment, Long userId) {
        log.info("Updating comment: {}", commentId);
        
        TicketComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        if (!comment.canEdit(userId)) {
            throw new IllegalStateException("You can only edit your own comments");
        }
        
        comment.setComment(newComment);
        TicketComment savedComment = commentRepository.save(comment);
        log.info("Updated comment: {}", commentId);
        
        return TicketCommentResponse.from(savedComment, userId);
    }
    
    public void deleteComment(Long commentId, Long userId) {
        log.info("Deleting comment: {}", commentId);
        
        TicketComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        if (!comment.canDelete(userId)) {
            throw new IllegalStateException("You can only delete your own comments");
        }
        
        commentRepository.delete(comment);
        log.info("Deleted comment: {}", commentId);
    }
    
    public TechnicianAssignmentResponse assignTechnician(Long ticketId, TechnicianAssignmentRequest request) {
        log.info("Assigning technician to ticket: {}", ticketId);
        
        Ticket ticket = getTicketEntity(ticketId);
        
        TechnicianAssignment assignment = TechnicianAssignment.builder()
                .ticket(ticket)
                .technicianId(request.getTechnicianId())
                .build();
        
        TechnicianAssignment savedAssignment = assignmentRepository.save(assignment);
        
        ticket.setStatus(Ticket.TicketStatus.IN_PROGRESS);
        ticketRepository.save(ticket);
        
        log.info("Assigned technician {} to ticket: {}", request.getTechnicianId(), ticketId);
        return TechnicianAssignmentResponse.from(savedAssignment);
    }
    
    private Ticket getTicketEntity(Long ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }
    
    private void validateStatusTransition(Ticket.TicketStatus currentStatus, Ticket.TicketStatus newStatus) {
        switch (currentStatus) {
            case OPEN:
                if (newStatus != Ticket.TicketStatus.IN_PROGRESS && 
                    newStatus != Ticket.TicketStatus.REJECTED && 
                    newStatus != Ticket.TicketStatus.CLOSED) {
                    throw new IllegalStateException("Invalid status transition from OPEN");
                }
                break;
            case IN_PROGRESS:
                if (newStatus != Ticket.TicketStatus.RESOLVED && 
                    newStatus != Ticket.TicketStatus.REJECTED && 
                    newStatus != Ticket.TicketStatus.CLOSED) {
                    throw new IllegalStateException("Invalid status transition from IN_PROGRESS");
                }
                break;
            case RESOLVED:
                if (newStatus != Ticket.TicketStatus.CLOSED) {
                    throw new IllegalStateException("Invalid status transition from RESOLVED");
                }
                break;
            case REJECTED:
            case CLOSED:
                throw new IllegalStateException("Cannot change status from " + currentStatus);
        }
    }
    
    private void updateTicketStatus(Long ticketId, Ticket.TicketStatus status) {
        Ticket ticket = getTicketEntity(ticketId);
        ticket.setStatus(status);
        ticketRepository.save(ticket);
    }
}
