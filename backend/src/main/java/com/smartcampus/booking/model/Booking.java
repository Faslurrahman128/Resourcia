package com.smartcampus.booking.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Document(collection = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    
    @Id
    private String id;
    
    @Indexed
    private String resourceId;
    
    @Indexed
    private String userId;
    
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String purpose;
    private Integer expectedAttendees;
    private BookingStatus status = BookingStatus.PENDING;
    private String rejectionReason;
    private String approvedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public boolean overlaps(LocalTime otherStart, LocalTime otherEnd) {
        return !(this.endTime.isBefore(otherStart) || this.startTime.isAfter(otherEnd));
    }
    
    public boolean canBeCancelled() {
        return this.status == BookingStatus.APPROVED;
    }
    
    public boolean isPending() {
        return this.status == BookingStatus.PENDING;
    }
}