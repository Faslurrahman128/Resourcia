package com.smartcampus.technicians.model;

import com.smartcampus.tickets.model.Ticket;
import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "technicians")
public class Technician {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    
    @Column(name = "phone")
    private String phone;
    
    @Column(name = "specialization")
    private String specialization;
    
    @Column(name = "department")
    private String department;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TechnicianStatus status;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Remove the mappedBy relationship since we simplified the entity
    // private List<TicketAssignment> assignedTickets;
    
    public enum TechnicianStatus {
        ACTIVE, INACTIVE, ON_LEAVE
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = TechnicianStatus.ACTIVE;
        }
    }
    
    // Getters and setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getSpecialization() {
        return specialization;
    }
    
    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }
    
    public String getDepartment() {
        return department;
    }
    
    public void setDepartment(String department) {
        this.department = department;
    }
    
    public TechnicianStatus getStatus() {
        return status;
    }
    
    public void setStatus(TechnicianStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    // Removed assignedTickets getter/setter since we simplified the entity
}
