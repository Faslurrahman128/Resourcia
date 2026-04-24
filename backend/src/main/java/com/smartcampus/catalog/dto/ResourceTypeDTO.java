package com.smartcampus.catalog.dto;

import javax.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResourceTypeDTO {

    private Integer typeId;

    @NotBlank(message = "Type name is required")
    private String typeName;
}
