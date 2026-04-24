package com.smartcampus.booking.dto.request;

import lombok.Data;
import javax.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BookingCreateRequest {
    
    @NotNull(message = "Resource ID is required")
    private Long resourceId;
    
    @NotNull(message = "Booking date is required")
    @FutureOrPresent(message = "Booking date cannot be in the past")
    private LocalDate bookingDate;
    
    @NotNull(message = "Start time is required")
    private LocalTime startTime;
    
    @NotNull(message = "End time is required")
    private LocalTime endTime;
    
    @NotBlank(message = "Purpose is required")
    @Size(max = 500, message = "Purpose cannot exceed 500 characters")
    private String purpose;
    
    @Min(value = 1, message = "Expected attendees must be at least 1")
    private Integer expectedAttendees;
    
    public boolean isTimeRangeValid() {
        if (startTime == null || endTime == null) return false;
        return startTime.isBefore(endTime);
    }
}
