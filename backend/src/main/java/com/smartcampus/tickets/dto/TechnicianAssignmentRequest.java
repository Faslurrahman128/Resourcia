package com.smartcampus.tickets.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class TechnicianAssignmentRequest {
    
    @NotNull(message = "Technician ID is required")
    private Long technicianId;
    
    private String technicianName;
    
    @NotNull(message = "Assigned by is required")
    private Long assignedBy;
}
