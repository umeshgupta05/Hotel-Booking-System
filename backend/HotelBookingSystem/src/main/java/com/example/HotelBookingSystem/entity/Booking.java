package com.example.HotelBookingSystem.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Hotel hotel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Room room;

    @com.fasterxml.jackson.annotation.JsonFormat(pattern="yyyy-MM-dd")
    private LocalDate checkIn;
    // Addition based on user prompt requirements
    @com.fasterxml.jackson.annotation.JsonFormat(pattern="yyyy-MM-dd")
    private LocalDate checkOut;

    private Double totalAmount;
    
    // e.g. "CONFIRMED", "CANCELLED", "PENDING"
    private String status;

    // Payment lock expiry for pending bookings in concurrent environments.
    @com.fasterxml.jackson.annotation.JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime lockExpiresAt;
}
