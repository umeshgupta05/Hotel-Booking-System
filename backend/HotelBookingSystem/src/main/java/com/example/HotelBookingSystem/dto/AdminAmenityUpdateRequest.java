package com.example.HotelBookingSystem.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Set;

@Data
public class AdminAmenityUpdateRequest {
    @NotNull
    private Set<Long> amenityIds;
}
