package com.smartcampus.booking.service;

import com.smartcampus.booking.dto.request.BookingCreateRequest;
import com.smartcampus.booking.dto.request.BookingStatusUpdateRequest;
import com.smartcampus.booking.dto.response.BookingResponse;
import com.smartcampus.booking.exception.BookingConflictException;
import com.smartcampus.booking.exception.BookingNotFoundException;
import com.smartcampus.booking.model.Booking;
import com.smartcampus.booking.model.BookingStatus;
import com.smartcampus.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingServiceImpl implements BookingService {
    
    private final BookingRepository bookingRepository;
    
    @Override
    public BookingResponse createBooking(BookingCreateRequest request, String userId) {
        log.info("Creating booking for user: {}", userId);
        
        if (!request.isTimeRangeValid()) {
            throw new IllegalArgumentException("Start time must be before end time");
        }
        
        Booking booking = new Booking();
        booking.setResourceId(request.getResourceId());
        booking.setUserId(Long.parseLong(userId));
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setExpectedAttendees(request.getExpectedAttendees());
        booking.setStatus(BookingStatus.PENDING);
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());
        
        // Check for conflicts with ALL active bookings (PENDING and APPROVED)
        validateNoConflict(booking);
        
        Booking savedBooking = bookingRepository.save(booking);
        log.info("Booking created successfully with ID: {}", savedBooking.getId());
        
        return mapToResponse(savedBooking);
    }

    @Override
    public BookingResponse updateBooking(String bookingId, BookingCreateRequest request, String userId, boolean isAdmin) {
        log.info("Updating booking {} by user: {}", bookingId, userId);

        if (!request.isTimeRangeValid()) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        Long userIdLong = Long.parseLong(userId);
        Booking booking = bookingRepository.findById(Long.parseLong(bookingId))
            .orElseThrow(() -> new BookingNotFoundException(bookingId));

        if (!booking.getUserId().equals(userIdLong) && !isAdmin) {
            throw new SecurityException("You can only update your own bookings");
        }

        if (!booking.isPending()) {
            throw new IllegalStateException("Only pending bookings can be updated");
        }

        booking.setResourceId(request.getResourceId());
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setExpectedAttendees(request.getExpectedAttendees());
        booking.setUpdatedAt(LocalDateTime.now());

        validateNoConflict(booking);

        Booking updatedBooking = bookingRepository.save(booking);
        return mapToResponse(updatedBooking);
    }
    
    @Override
    public BookingResponse updateBookingStatus(String bookingId, BookingStatusUpdateRequest request, String adminId) {
        log.info("Updating booking {} status to {} by admin: {}", bookingId, request.getStatus(), adminId);
        Booking booking = bookingRepository.findById(Long.parseLong(bookingId))
            .orElseThrow(() -> new BookingNotFoundException(bookingId));
        
        if (!booking.isPending()) {
            throw new IllegalStateException("Only pending bookings can be approved or rejected");
        }
        
        if (request.getStatus() == BookingStatus.REJECTED && 
            (request.getReason() == null || request.getReason().trim().isEmpty())) {
            throw new IllegalArgumentException("Reason is required for rejection");
        }
        
        booking.setStatus(request.getStatus());
        booking.setApprovedBy(adminId);
        booking.setUpdatedAt(LocalDateTime.now());
        
        if (request.getStatus() == BookingStatus.REJECTED) {
            booking.setRejectionReason(request.getReason());
        }
        
        Booking updatedBooking = bookingRepository.save(booking);
        return mapToResponse(updatedBooking);
    }
    
    @Override
    public BookingResponse cancelBooking(String bookingId, String userId) {
        log.info("Cancelling booking {} by user: {}", bookingId, userId);
        Booking booking = bookingRepository.findById(Long.parseLong(bookingId))
            .orElseThrow(() -> new BookingNotFoundException(bookingId));
        if (!booking.getUserId().toString().equals(userId)) {
            throw new SecurityException("You can only cancel your own bookings");
        }
        if (!booking.canBeCancelled()) {
            throw new IllegalStateException("Only approved bookings can be cancelled");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());
        Booking cancelledBooking = bookingRepository.save(booking);
        return mapToResponse(cancelledBooking);
    }
    
    @Override
    public BookingResponse getBookingById(String bookingId, String userId, boolean isAdmin) {
        Booking booking = bookingRepository.findById(Long.parseLong(bookingId))
            .orElseThrow(() -> new BookingNotFoundException(bookingId));
        Long userIdLong = Long.parseLong(userId);
        
        if (!booking.getUserId().equals(userIdLong) && !isAdmin) {
            throw new SecurityException("You don't have permission to view this booking");
        }
        
        return mapToResponse(booking);
    }
    
    @Override
    public Page<BookingResponse> getUserBookings(String userId, Pageable pageable) {
        return bookingRepository.findByUserId(Long.parseLong(userId), pageable)
            .map(this::mapToResponse);
    }
    
    @Override
    public Page<BookingResponse> getAllBookings(String resourceId, String userId, String status, 
                                                 LocalDate startDate, LocalDate endDate, 
                                                 Pageable pageable) {
        String resourceIdFilter = (resourceId == null || resourceId.isBlank()) ? null : resourceId.trim();
        Long userIdLong = (userId == null || userId.isBlank()) ? null : Long.parseLong(userId);
        BookingStatus bookingStatus = (status == null || status.isBlank()) ? null : BookingStatus.valueOf(status.toUpperCase());

        return bookingRepository.findWithFilters(resourceIdFilter, userIdLong, bookingStatus, startDate, endDate, pageable)
            .map(this::mapToResponse);
    }
    
    @Override
    public void deleteBooking(String bookingId, String adminId) {
        Booking booking = bookingRepository.findById(Long.parseLong(bookingId))
            .orElseThrow(() -> new BookingNotFoundException(bookingId));
        
        bookingRepository.delete(booking);
        log.info("Booking {} deleted by admin: {}", bookingId, adminId);
    }
    
    private void validateNoConflict(Booking newBooking) {
        // Get ALL existing bookings for this resource on the same date
        List<Booking> existingBookings = bookingRepository.findByResourceIdAndBookingDate(
            newBooking.getResourceId(),
            newBooking.getBookingDate()
        );
        
        for (Booking existing : existingBookings) {
            // Skip the booking we're updating (if it's an update)
            if (existing.getId() != null && existing.getId().equals(newBooking.getId())) {
                continue;
            }
            
            // Skip CANCELLED and REJECTED bookings
            if (existing.getStatus() == BookingStatus.CANCELLED || 
                existing.getStatus() == BookingStatus.REJECTED) {
                continue;
            }
            
            // Check for time overlap
            if (existing.overlaps(newBooking.getStartTime(), newBooking.getEndTime())) {
                throw new BookingConflictException(
                    String.format("Resource is already booked from %s to %s on %s (Status: %s)", 
                        existing.getStartTime(), 
                        existing.getEndTime(),
                        existing.getBookingDate(),
                        existing.getStatus())
                );
            }
        }
    }
    
    private BookingResponse mapToResponse(Booking booking) {
        return BookingResponse.builder()
            .id(String.valueOf(booking.getId()))
            .resourceId(booking.getResourceId())
            .userId(String.valueOf(booking.getUserId()))
            .bookingDate(booking.getBookingDate())
            .startTime(booking.getStartTime())
            .endTime(booking.getEndTime())
            .purpose(booking.getPurpose())
            .expectedAttendees(booking.getExpectedAttendees())
            .status(booking.getStatus())
            .rejectionReason(booking.getRejectionReason())
            // .approvedBy(booking.getApprovedBy()) // removed, not present in Booking
            .createdAt(booking.getCreatedAt())
            .updatedAt(booking.getUpdatedAt())
            .build();
    }
}
