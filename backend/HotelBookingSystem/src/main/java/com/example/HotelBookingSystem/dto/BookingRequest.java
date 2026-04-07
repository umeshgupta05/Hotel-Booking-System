package com.example.HotelBookingSystem.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
public class BookingRequest {
    @NotNull
    private Long hotelId;

    @NotNull
    private Long roomId;

    @NotNull
    @com.fasterxml.jackson.annotation.JsonFormat(pattern="yyyy-MM-dd")
    private LocalDate checkIn;

    @NotNull
    @com.fasterxml.jackson.annotation.JsonFormat(pattern="yyyy-MM-dd")
    private LocalDate checkOut;
}
