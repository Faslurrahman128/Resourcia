package com.smartcampus.technicians.dto;

import com.smartcampus.technicians.model.Technician;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TechnicianResponse {
    
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String specialization;
    private String department;
    private Technician.TechnicianStatus status;
    private LocalDateTime createdAt;
    
    public static TechnicianResponse from(Technician technician) {
        TechnicianResponse response = new TechnicianResponse();
        response.setId(technician.getId());
        response.setName(technician.getName());
        response.setEmail(technician.getEmail());
        response.setPhone(technician.getPhone());
        response.setSpecialization(technician.getSpecialization());
        response.setDepartment(technician.getDepartment());
        response.setStatus(technician.getStatus());
        response.setCreatedAt(technician.getCreatedAt());
        return response;
    }
}
