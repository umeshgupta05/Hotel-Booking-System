package com.example.HotelBookingSystem.controller;

import com.example.HotelBookingSystem.entity.Notification;
import com.example.HotelBookingSystem.entity.User;
import com.example.HotelBookingSystem.security.UserDetailsImpl;
import com.example.HotelBookingSystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    private Long getCurrentUserId() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getId();
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile() {
        return ResponseEntity.ok(userService.getProfile(getCurrentUserId()));
    }

    @GetMapping("/{id}/notifications")
    public ResponseEntity<List<Notification>> getNotifications(@PathVariable Long id) {
        if (!id.equals(getCurrentUserId())) {
            throw new RuntimeException("Unauthorized");
        }
        return ResponseEntity.ok(userService.getNotifications(id));
    }
}
