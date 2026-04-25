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
@Table(name = "ticket_comments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketComment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long id;
    
    @NotNull(message = "Ticket is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @NotBlank(message = "Comment text is required")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String comment;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public boolean canEdit(Long currentUserId) {
        return userId.equals(currentUserId);
    }
    
    public boolean canDelete(Long currentUserId) {
        return userId.equals(currentUserId);
    }
}
