package com.example.HotelBookingSystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AdminRoomRequest {
    @NotBlank
    private String roomNumber;

    @NotNull
    private Long categoryId;

    @NotNull
    private Boolean availability;
}
