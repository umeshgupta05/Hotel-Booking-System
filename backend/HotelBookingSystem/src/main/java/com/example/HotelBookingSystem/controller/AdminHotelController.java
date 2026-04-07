package com.example.HotelBookingSystem.controller;

import com.example.HotelBookingSystem.dto.AdminAmenityUpdateRequest;
import com.example.HotelBookingSystem.dto.AdminHotelPublishRequest;
import com.example.HotelBookingSystem.dto.AdminHotelUpdateRequest;
import com.example.HotelBookingSystem.dto.AdminRoomRequest;
import com.example.HotelBookingSystem.entity.Amenity;
import com.example.HotelBookingSystem.entity.Hotel;
import com.example.HotelBookingSystem.entity.Room;
import com.example.HotelBookingSystem.entity.RoomCategory;
import com.example.HotelBookingSystem.security.UserDetailsImpl;
import com.example.HotelBookingSystem.service.AdminHotelService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminHotelController {

    @Autowired
    private AdminHotelService adminHotelService;

    private Long getCurrentUserId() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getId();
    }

    @GetMapping("/hotel")
    public ResponseEntity<Hotel> getMyHotel() {
        return ResponseEntity.ok(adminHotelService.getMyHotel(getCurrentUserId()));
    }

    @PostMapping("/hotel/publish")
    public ResponseEntity<Hotel> publishMyHotel(@Valid @RequestBody AdminHotelPublishRequest request) {
        return ResponseEntity.ok(adminHotelService.publishMyHotel(getCurrentUserId(), request));
    }

    @PutMapping("/hotel")
    public ResponseEntity<Hotel> updateMyHotel(@Valid @RequestBody AdminHotelUpdateRequest request) {
        return ResponseEntity.ok(adminHotelService.updateMyHotel(getCurrentUserId(), request));
    }

    @PutMapping("/hotel/amenities")
    public ResponseEntity<Hotel> updateMyHotelAmenities(@Valid @RequestBody AdminAmenityUpdateRequest request) {
        return ResponseEntity.ok(adminHotelService.updateMyHotelAmenities(getCurrentUserId(), request));
    }

    @GetMapping("/hotel/rooms")
    public ResponseEntity<List<Room>> getMyHotelRooms() {
        return ResponseEntity.ok(adminHotelService.getMyHotelRooms(getCurrentUserId()));
    }

    @PostMapping("/hotel/rooms")
    public ResponseEntity<Room> createRoom(@Valid @RequestBody AdminRoomRequest request) {
        return ResponseEntity.ok(adminHotelService.createRoom(getCurrentUserId(), request));
    }

    @PutMapping("/hotel/rooms/{roomId}")
    public ResponseEntity<Room> updateRoom(@PathVariable Long roomId, @Valid @RequestBody AdminRoomRequest request) {
        return ResponseEntity.ok(adminHotelService.updateRoom(getCurrentUserId(), roomId, request));
    }

    @DeleteMapping("/hotel/rooms/{roomId}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long roomId) {
        adminHotelService.deleteRoom(getCurrentUserId(), roomId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/amenities")
    public ResponseEntity<List<Amenity>> getAmenities() {
        return ResponseEntity.ok(adminHotelService.getAllAmenities());
    }

    @GetMapping("/room-categories")
    public ResponseEntity<List<RoomCategory>> getRoomCategories() {
        return ResponseEntity.ok(adminHotelService.getAllRoomCategories());
    }
}
