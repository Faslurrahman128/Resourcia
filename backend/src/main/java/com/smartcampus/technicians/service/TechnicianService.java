package com.smartcampus.technicians.service;

import com.smartcampus.technicians.dto.TechnicianResponse;
import com.smartcampus.technicians.dto.TicketAssignmentRequest;
import com.smartcampus.technicians.dto.TicketAssignmentResponse;
import com.smartcampus.technicians.model.Technician;
import com.smartcampus.technicians.model.TicketAssignment;
import com.smartcampus.technicians.model.Technician.TechnicianStatus;
import com.smartcampus.technicians.repository.TechnicianRepository;
import com.smartcampus.technicians.repository.TicketAssignmentRepository;
import com.smartcampus.tickets.model.Ticket;
import com.smartcampus.tickets.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TechnicianService {
    
    private final TechnicianRepository technicianRepository;
    private final TicketAssignmentRepository assignmentRepository;
    private final TicketRepository ticketRepository;
    
    public List<TechnicianResponse> getAllTechnicians() {
        List<Technician> technicians = technicianRepository.findAll();
        return technicians.stream()
                .map(TechnicianResponse::from)
                .collect(Collectors.toList());
    }
    
    public List<TechnicianResponse> getActiveTechnicians() {
        List<Technician> technicians = technicianRepository.findByStatus(TechnicianStatus.ACTIVE);
        return technicians.stream()
                .map(TechnicianResponse::from)
                .collect(Collectors.toList());
    }
    
    public TechnicianResponse getTechnicianById(Long id) {
        Technician technician = technicianRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Technician not found with id: " + id));
        return TechnicianResponse.from(technician);
    }
    
    @Transactional
    public TicketAssignmentResponse assignTicket(TicketAssignmentRequest request) {
        log.info("Assigning ticket {} to technician {}", request.getTicketId(), request.getTechnicianId());
        
        Ticket ticket = ticketRepository.findById(request.getTicketId())
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + request.getTicketId()));
        
        Technician technician = technicianRepository.findById(request.getTechnicianId())
                .orElseThrow(() -> new RuntimeException("Technician not found with id: " + request.getTechnicianId()));
        
        // Check if ticket is already assigned
        assignmentRepository.findByTicketId(request.getTicketId()).ifPresent(existing -> {
            throw new RuntimeException("Ticket is already assigned to a technician");
        });
        
        TicketAssignment assignment = TicketAssignment.builder()
                .ticketId(request.getTicketId())
                .technicianId(request.getTechnicianId())
                .assignedBy(request.getAssignedBy())
                .notes(request.getNotes())
                .assignmentStatus(request.getAssignmentStatus())
                .build();
        
        TicketAssignment savedAssignment = assignmentRepository.save(assignment);
        
        // Update ticket status to ASSIGNED
        ticket.setStatus(Ticket.TicketStatus.ASSIGNED);
        ticketRepository.save(ticket);
        
        log.info("Ticket {} assigned to technician {} with assignment ID: {}", 
                request.getTicketId(), request.getTechnicianId(), savedAssignment.getId());
        
        return TicketAssignmentResponse.from(savedAssignment);
    }
    
    public List<TicketAssignmentResponse> getAssignmentsByTechnician(Long technicianId) {
        List<TicketAssignment> assignments = assignmentRepository.findAssignmentsByTechnicianId(technicianId);
        return assignments.stream()
                .map(TicketAssignmentResponse::from)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public TicketAssignmentResponse updateAssignmentStatus(Long assignmentId, TicketAssignment.AssignmentStatus status) {
        TicketAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found with id: " + assignmentId));
        
        assignment.setAssignmentStatus(status);
        
        // Update ticket status based on assignment status
        Ticket ticket = ticketRepository.findById(assignment.getTicketId())
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + assignment.getTicketId()));
        switch (status) {
            case IN_PROGRESS:
                ticket.setStatus(Ticket.TicketStatus.IN_PROGRESS);
                break;
            case COMPLETED:
                ticket.setStatus(Ticket.TicketStatus.COMPLETED);
                break;
            case REJECTED:
                ticket.setStatus(Ticket.TicketStatus.OPEN);
                break;
            default:
                break;
        }
        
        ticketRepository.save(ticket);
        TicketAssignment savedAssignment = assignmentRepository.save(assignment);
        
        log.info("Assignment {} status updated to {}", assignmentId, status);
        
        return TicketAssignmentResponse.from(savedAssignment);
    }
    
    @Transactional
    public void reassignTicket(Long ticketId, Long newTechnicianId, Long assignedBy) {
        log.info("Reassigning ticket {} to technician {}", ticketId, newTechnicianId);
        
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + ticketId));
        
        Technician newTechnician = technicianRepository.findById(newTechnicianId)
                .orElseThrow(() -> new RuntimeException("Technician not found with id: " + newTechnicianId));
        
        // Remove existing assignment
        assignmentRepository.deleteByTicketId(ticketId);
        
        // Create new assignment
        TicketAssignment newAssignment = TicketAssignment.builder()
                .ticketId(ticketId)
                .technicianId(newTechnicianId)
                .assignedBy(assignedBy)
                .assignmentStatus(TicketAssignment.AssignmentStatus.ASSIGNED)
                .build();
        
        assignmentRepository.save(newAssignment);
        
        // Update ticket status
        ticket.setStatus(Ticket.TicketStatus.ASSIGNED);
        ticketRepository.save(ticket);
        
        log.info("Ticket {} reassigned to technician {}", ticketId, newTechnicianId);
    }
}
