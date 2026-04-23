package com.smartcampus.catalog.repository;

import com.smartcampus.catalog.model.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceTypeRepository extends JpaRepository<ResourceType, Integer> {
}
