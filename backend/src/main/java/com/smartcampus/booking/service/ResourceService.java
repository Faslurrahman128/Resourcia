package com.smartcampus.booking.service;

import com.smartcampus.booking.model.Resource;
import com.smartcampus.booking.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceService {
    private final ResourceRepository resourceRepository;

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public List<Resource> getResourcesByBuilding(String building) {
        return resourceRepository.findByBuilding(building);
    }
}
