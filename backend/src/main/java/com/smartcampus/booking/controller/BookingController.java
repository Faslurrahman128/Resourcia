package com.smartcampus.booking.controller;

import com.smartcampus.booking.dto.request.BookingCreateRequest;
import com.smartcampus.booking.dto.request.BookingStatusUpdateRequest;
import com.smartcampus.booking.dto.response.BookingResponse;
import com.smartcampus.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.servlet.http.HttpServletRequest;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5000")
public class BookingController {
    
    private final BookingService bookingService;
    
    private String getCurrentUserId(HttpServletRequest httpRequest) {
        String userId = httpRequest.getHeader("X-User-Id");
        if (userId == null || userId.isBlank()) {
            throw new IllegalArgumentException("X-User-Id header is required");
        }
        return userId;
    }
    
    private String getCurrentAdminId(HttpServletRequest httpRequest) {
        return getCurrentUserId(httpRequest);
    }
    
    private boolean isAdmin(HttpServletRequest httpRequest) {
        String role = httpRequest.getHeader("X-User-Role");
        return role != null && "ADMIN".equalsIgnoreCase(role.trim());
    }
    
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingCreateRequest request,
                                                         HttpServletRequest httpRequest) {
        BookingResponse response = bookingService.createBooking(request, getCurrentUserId(httpRequest));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookingResponse> updateBooking(@PathVariable String id,
                                                         @Valid @RequestBody BookingCreateRequest request,
                                                         HttpServletRequest httpRequest) {
        BookingResponse response = bookingService.updateBooking(
            id,
            request,
            getCurrentUserId(httpRequest),
            isAdmin(httpRequest)
        );
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<BookingResponse>> getUserBookings(
            @PathVariable String userId,
            HttpServletRequest httpRequest,
            Pageable pageable) {
        if (!userId.equals(getCurrentUserId(httpRequest)) && !isAdmin(httpRequest)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Page<BookingResponse> bookings = bookingService.getUserBookings(userId, pageable);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping
    public ResponseEntity<Page<BookingResponse>> getAllBookings(
            @RequestParam(required = false) String resourceId,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            HttpServletRequest httpRequest,
            Pageable pageable) {
        
        if (!isAdmin(httpRequest)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        Page<BookingResponse> bookings = bookingService.getAllBookings(
            resourceId, userId, status, startDate, endDate, pageable);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable String id, HttpServletRequest httpRequest) {
        BookingResponse booking = bookingService.getBookingById(id, getCurrentUserId(httpRequest), isAdmin(httpRequest));
        return ResponseEntity.ok(booking);
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<BookingResponse> updateBookingStatus(
            @PathVariable String id,
            @Valid @RequestBody BookingStatusUpdateRequest request,
            HttpServletRequest httpRequest) {
        
        if (!isAdmin(httpRequest)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        BookingResponse response = bookingService.updateBookingStatus(id, request, getCurrentAdminId(httpRequest));
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable String id, HttpServletRequest httpRequest) {
        BookingResponse response = bookingService.cancelBooking(id, getCurrentUserId(httpRequest));
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable String id, HttpServletRequest httpRequest) {
        if (!isAdmin(httpRequest)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        bookingService.deleteBooking(id, getCurrentAdminId(httpRequest));
        return ResponseEntity.noContent().build();
    }
}