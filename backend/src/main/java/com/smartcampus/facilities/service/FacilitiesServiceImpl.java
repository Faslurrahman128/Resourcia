package com.smartcampus.facilities.service;

import com.smartcampus.facilities.dto.ResourceRequest;
import com.smartcampus.facilities.dto.ResourceResponse;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.List;

@Service
public class FacilitiesServiceImpl implements FacilitiesService {
    @Override
    public List<ResourceResponse> getResources(String type, Integer minCapacity, String location) {
        return Collections.emptyList();
    }

    @Override
    public ResourceResponse createResource(ResourceRequest request) {
        return null;
    }

    @Override
    public ResourceResponse updateResource(Long id, ResourceRequest request) {
        return null;
    }

    @Override
    public void deleteResource(Long id) {
        // TODO: Implement delete resource logic.
    }
}
