package com.example.HotelBookingSystem.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
public class PaymentRequest {
    @NotNull
    @JsonAlias({"booking_id"})
    private Long bookingId;

    @JsonAlias({"total_amount"})
    private Double amount;
    
    @JsonAlias({"payment_method"})
    private String method;
}
