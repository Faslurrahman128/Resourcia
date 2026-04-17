package com.smartcampus.facilities.service;

import com.smartcampus.facilities.dto.ResourceRequest;
import com.smartcampus.facilities.dto.ResourceResponse;
import java.util.List;

public interface FacilitiesService {
    List<ResourceResponse> getResources(String type, Integer minCapacity, String location);

    ResourceResponse createResource(ResourceRequest request);

    ResourceResponse updateResource(Long id, ResourceRequest request);

    void deleteResource(Long id);
}
