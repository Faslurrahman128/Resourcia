package com.smartcampus.booking.service;

import com.smartcampus.booking.dto.request.BookingCreateRequest;
import com.smartcampus.booking.dto.request.BookingStatusUpdateRequest;
import com.smartcampus.booking.dto.response.BookingResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDate;

public interface BookingService {
    
    BookingResponse createBooking(BookingCreateRequest request, String userId);

    BookingResponse updateBooking(String bookingId, BookingCreateRequest request, String userId, boolean isAdmin);
    
    BookingResponse updateBookingStatus(String bookingId, BookingStatusUpdateRequest request, String adminId);
    
    BookingResponse cancelBooking(String bookingId, String userId);
    
    BookingResponse getBookingById(String bookingId, String userId, boolean isAdmin);
    
    Page<BookingResponse> getUserBookings(String userId, Pageable pageable);
    
    Page<BookingResponse> getAllBookings(String resourceId, String userId, String status, 
                                         LocalDate startDate, LocalDate endDate, 
                                         Pageable pageable);
    
    void deleteBooking(String bookingId, String adminId);
}