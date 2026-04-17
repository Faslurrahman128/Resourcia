package com.smartcampus.facilities.controller;

import com.smartcampus.facilities.dto.ResourceRequest;
import com.smartcampus.facilities.dto.ResourceResponse;
import com.smartcampus.facilities.service.FacilitiesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/facilities")
@RequiredArgsConstructor
public class FacilitiesController {
    private final FacilitiesService facilitiesService;

    @GetMapping("/resources")
    public ResponseEntity<List<ResourceResponse>> getResources(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) String location) {
        return ResponseEntity.ok(facilitiesService.getResources(type, minCapacity, location));
    }

    @PostMapping("/resources")
    public ResponseEntity<ResourceResponse> createResource(@RequestBody ResourceRequest request) {
        ResourceResponse response = facilitiesService.createResource(request);
        if (response == null) {
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/resources/{id}")
    public ResponseEntity<ResourceResponse> updateResource(@PathVariable Long id, @RequestBody ResourceRequest request) {
        ResourceResponse response = facilitiesService.updateResource(id, request);
        if (response == null) {
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
        }
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/resources/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        facilitiesService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}
