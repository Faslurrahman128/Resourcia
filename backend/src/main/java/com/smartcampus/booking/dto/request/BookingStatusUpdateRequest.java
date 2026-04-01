package com.smartcampus.booking.dto.request;

import com.smartcampus.booking.model.BookingStatus;
import lombok.Data;
import javax.validation.constraints.NotNull;

@Data
public class BookingStatusUpdateRequest {
    
    @NotNull(message = "Status is required")
    private BookingStatus status;
    
    private String reason;
}
