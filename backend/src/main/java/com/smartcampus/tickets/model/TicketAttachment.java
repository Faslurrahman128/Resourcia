package com.smartcampus.tickets.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "ticket_images")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketAttachment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id")
    private Long id;
    
    @NotNull(message = "Ticket is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;
    
    @NotBlank(message = "Image URL is required")
    @Column(name = "image_url", nullable = false)
    private String imageUrl;
    
    @PrePersist
    protected void onCreate() {
        // No timestamp needed as SQL schema uses DEFAULT CURRENT_TIMESTAMP
    }
}
