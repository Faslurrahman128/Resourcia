package com.smartcampus.booking.service;

import com.smartcampus.booking.model.BookingResource;
import com.smartcampus.booking.repository.BookingResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingResourceService {
    private final BookingResourceRepository resourceRepository;

    public List<BookingResource> getAllResources() {
        return resourceRepository.findAll();
    }

    public List<BookingResource> getResourcesByBuilding(String building) {
        return resourceRepository.findByBuilding(building);
    }
}
