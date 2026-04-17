package com.smartcampus.booking.dto.response;

import com.smartcampus.booking.model.BookingStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
public class BookingResponse {
    private String id;
    private Long resourceId;
    private String resourceName;
    private String resourceType;
    private String resourceLocation;
    private String userId;
    private String userName;
    private String userEmail;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String purpose;
    private Integer expectedAttendees;
    private BookingStatus status;
    private String rejectionReason;
    private String approvedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}