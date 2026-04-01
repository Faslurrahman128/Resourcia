package com.smartcampus.booking.repository;

import com.smartcampus.booking.model.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    
    Page<Booking> findByUserId(String userId, Pageable pageable);
    
    List<Booking> findByResourceIdAndBookingDate(String resourceId, LocalDate bookingDate);
}
