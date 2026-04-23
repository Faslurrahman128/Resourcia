package com.smartcampus.booking.controller;

import com.smartcampus.booking.model.BookingResource;
import com.smartcampus.booking.service.BookingResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class BookingResourceController {
    private final BookingResourceService resourceService;

    @GetMapping
    public ResponseEntity<List<BookingResource>> getAllResources() {
        List<BookingResource> resources = resourceService.getAllResources();
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/building/{building}")
    public ResponseEntity<List<BookingResource>> getResourcesByBuilding(@PathVariable String building) {
        List<BookingResource> resources = resourceService.getResourcesByBuilding(building);
        return ResponseEntity.ok(resources);
    }
}
