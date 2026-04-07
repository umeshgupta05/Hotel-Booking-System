package com.example.HotelBookingSystem.controller;

import com.example.HotelBookingSystem.entity.Hotel;
import com.example.HotelBookingSystem.entity.Room;
import com.example.HotelBookingSystem.repository.RoomRepository;
import com.example.HotelBookingSystem.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/hotels")
public class HotelController {
    @Autowired
    HotelService hotelService;

    @Autowired
    RoomRepository roomRepository;

    @GetMapping
    public ResponseEntity<List<Hotel>> getHotels(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double rating,
            @RequestParam(required = false) Long amenityId) {
        return ResponseEntity.ok(hotelService.searchHotels(q, city, rating, amenityId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hotel> getHotelById(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getHotelById(id));
    }

    @GetMapping("/{id}/rooms")
    public ResponseEntity<List<Room>> getAvailableRooms(
            @PathVariable Long id,
            @RequestParam LocalDate checkIn,
            @RequestParam LocalDate checkOut) {
        return ResponseEntity.ok(roomRepository.findAvailableRooms(id, checkIn, checkOut));
    }
}
