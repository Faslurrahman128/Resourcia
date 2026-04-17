package com.smartcampus.booking.controller;

import com.smartcampus.booking.model.Resource;
import com.smartcampus.booking.service.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {
    private final ResourceService resourceService;

    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources() {
        List<Resource> resources = resourceService.getAllResources();
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/building/{building}")
    public ResponseEntity<List<Resource>> getResourcesByBuilding(@PathVariable String building) {
        List<Resource> resources = resourceService.getResourcesByBuilding(building);
        return ResponseEntity.ok(resources);
    }
}
