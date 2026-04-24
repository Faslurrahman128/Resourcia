package com.smartcampus.catalog.dto;

import com.smartcampus.catalog.model.Resource.Status;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalTime;

@Data
public class ResourceDTO {

    private Integer resourceId;

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Type ID is required")
    private Integer typeId;

    private String typeName; // for response only

    private Integer capacity;

    @NotBlank(message = "Location is required")
    private String location;

    private Status status;

    private LocalTime availabilityStart;
    private LocalTime availabilityEnd;
}
