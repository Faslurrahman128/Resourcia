package com.smartcampus.booking.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import javax.persistence.*;

@Entity
@Table(name = "resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Resource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resource_id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "building", nullable = false)
    private String building; // e.g., "Main Building" or "New Building"

    @Column(name = "type", nullable = false)
    private String type; // e.g., "Lecture Hall", "Lab"

    @Column(name = "status", nullable = false)
    private String status; // e.g., "ACTIVE", "OUT_OF_SERVICE"

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "location")
    private String location;

    @Column(name = "availability_start")
    private String availabilityStart; // Store as string for simplicity (e.g., "08:00")

    @Column(name = "availability_end")
    private String availabilityEnd;
}
