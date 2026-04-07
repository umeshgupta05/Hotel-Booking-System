package com.example.HotelBookingSystem.controller;

import com.example.HotelBookingSystem.dto.BookingRequest;
import com.example.HotelBookingSystem.entity.Booking;
import com.example.HotelBookingSystem.security.UserDetailsImpl;
import com.example.HotelBookingSystem.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    @Autowired
    private BookingService bookingService;

    private Long getCurrentUserId() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getId();
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(@Valid @RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.createBooking(getCurrentUserId(), request));
    }

    @GetMapping("/my-history")
    public ResponseEntity<List<Booking>> getMyHistory() {
        return ResponseEntity.ok(bookingService.getUserHistory(getCurrentUserId()));
    }

    @GetMapping("/my-history/paged")
    public ResponseEntity<Page<Booking>> getMyHistoryPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "bookingId") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(bookingService.getUserHistoryPaged(getCurrentUserId(), page, size, sortBy, sortDir));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingDetails(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBooking(id));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }
}
