package com.example.HotelBookingSystem.dto;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class AdminHotelUpdateRequest {
    private String name;
    private String description;
    private Double basePrice;
    private String imageUrl;

    @Email
    private String contactEmail;

    private String contactPhone;
}
