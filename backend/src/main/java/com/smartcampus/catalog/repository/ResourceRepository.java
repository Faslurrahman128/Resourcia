package com.smartcampus.catalog.repository;

import com.smartcampus.catalog.model.Resource;
import com.smartcampus.catalog.model.Resource.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, Integer> {

    List<Resource> findByResourceType_TypeId(Integer typeId);

    List<Resource> findByStatus(Status status);

    List<Resource> findByLocationContainingIgnoreCase(String location);

    List<Resource> findByCapacityGreaterThanEqual(Integer capacity);
}
