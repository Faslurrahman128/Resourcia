package com.smartcampus.booking.repository;

import com.smartcampus.booking.model.BookingResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingResourceRepository extends JpaRepository<BookingResource, Long> {
    List<BookingResource> findByBuilding(String building);
}
