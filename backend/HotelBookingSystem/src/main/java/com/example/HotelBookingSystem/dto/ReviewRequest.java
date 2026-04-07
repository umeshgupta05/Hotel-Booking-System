package com.example.HotelBookingSystem.dto;

import lombok.Data;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

@Data
public class ReviewRequest {
    @NotNull
    private Long hotelId;
    
    @NotNull
    @DecimalMin(value = "1.0", inclusive = true)
    @DecimalMax(value = "5.0", inclusive = true)
    private Double rating;
    
    private String comment;
}
