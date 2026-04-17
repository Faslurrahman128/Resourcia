package com.smartcampus.booking.repository;

import com.smartcampus.booking.model.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Page<Booking> findByUserId(Long userId, Pageable pageable);

    List<Booking> findByResourceIdAndBookingDate(Long resourceId, LocalDate bookingDate);

    @Query("SELECT b FROM Booking b " +
           "WHERE (:resourceId IS NULL OR b.resourceId = :resourceId) " +
           "AND (:userId IS NULL OR b.userId = :userId) " +
           "AND (:status IS NULL OR b.status = :status) " +
           "AND (:startDate IS NULL OR b.bookingDate >= :startDate) " +
           "AND (:endDate IS NULL OR b.bookingDate <= :endDate)")
    Page<Booking> findWithFilters(@Param("resourceId") Long resourceId,
                                  @Param("userId") Long userId,
                                  @Param("status") com.smartcampus.booking.model.BookingStatus status,
                                  @Param("startDate") LocalDate startDate,
                                  @Param("endDate") LocalDate endDate,
                                  Pageable pageable);
}
