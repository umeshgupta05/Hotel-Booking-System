package com.example.HotelBookingSystem.dto;

import lombok.Data;

@Data
public class RazorpayOrderRequest {
    private Long amount; // stored in cents/paise (i.e. amount * 100)
    private String currency;
    private String receipt;
    private Long bookingId; // Link it to the pending booking
}
