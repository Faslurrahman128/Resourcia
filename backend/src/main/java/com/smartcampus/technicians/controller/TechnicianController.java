package com.smartcampus.technicians.controller;

import com.smartcampus.technicians.dto.TechnicianResponse;
import com.smartcampus.technicians.dto.TicketAssignmentRequest;
import com.smartcampus.technicians.dto.TicketAssignmentResponse;
import com.smartcampus.technicians.model.TicketAssignment;
import com.smartcampus.technicians.service.TechnicianService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/technicians")
@RequiredArgsConstructor
@Slf4j
@Validated
@CrossOrigin(origins = "http://localhost:3000")
public class TechnicianController {
    
    private final TechnicianService technicianService;
    
    @GetMapping
    public ResponseEntity<List<TechnicianResponse>> getAllTechnicians() {
        log.info("Fetching all technicians");
        List<TechnicianResponse> technicians = technicianService.getAllTechnicians();
        return ResponseEntity.ok(technicians);
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<TechnicianResponse>> getActiveTechnicians() {
        log.info("Fetching active technicians");
        List<TechnicianResponse> technicians = technicianService.getActiveTechnicians();
        return ResponseEntity.ok(technicians);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TechnicianResponse> getTechnicianById(@PathVariable Long id) {
        log.info("Fetching technician with id: {}", id);
        TechnicianResponse technician = technicianService.getTechnicianById(id);
        return ResponseEntity.ok(technician);
    }
    
    @PostMapping("/assign")
    public ResponseEntity<TicketAssignmentResponse> assignTicket(@Valid @RequestBody TicketAssignmentRequest request) {
        log.info("Assigning ticket {} to technician {}", request.getTicketId(), request.getTechnicianId());
        try {
            TicketAssignmentResponse response = technicianService.assignTicket(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error assigning ticket: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{technicianId}/assignments")
    public ResponseEntity<List<TicketAssignmentResponse>> getTechnicianAssignments(@PathVariable Long technicianId) {
        log.info("Fetching assignments for technician: {}", technicianId);
        List<TicketAssignmentResponse> assignments = technicianService.getAssignmentsByTechnician(technicianId);
        return ResponseEntity.ok(assignments);
    }
    
    @PutMapping("/assignments/{assignmentId}/status")
    public ResponseEntity<TicketAssignmentResponse> updateAssignmentStatus(
            @PathVariable Long assignmentId,
            @RequestBody TicketAssignment.AssignmentStatus status) {
        log.info("Updating assignment {} status to {}", assignmentId, status);
        try {
            TicketAssignmentResponse response = technicianService.updateAssignmentStatus(assignmentId, status);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error updating assignment status: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/tickets/{ticketId}/reassign")
    public ResponseEntity<Void> reassignTicket(
            @PathVariable Long ticketId,
            @RequestParam Long newTechnicianId,
            @RequestParam Long assignedBy) {
        log.info("Reassigning ticket {} to technician {}", ticketId, newTechnicianId);
        try {
            technicianService.reassignTicket(ticketId, newTechnicianId, assignedBy);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error reassigning ticket: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }
}
