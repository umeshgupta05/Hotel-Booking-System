package com.example.HotelBookingSystem.controller;

import com.example.HotelBookingSystem.entity.Amenity;
import com.example.HotelBookingSystem.repository.AmenityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/amenities")
public class AmenityController {
    @Autowired
    private AmenityRepository amenityRepository;

    @GetMapping
    public ResponseEntity<List<Amenity>> getAllAmenities() {
        return ResponseEntity.ok(amenityRepository.findAll());
    }
}
