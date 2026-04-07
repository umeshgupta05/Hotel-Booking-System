package com.example.HotelBookingSystem.controller;

import com.example.HotelBookingSystem.dto.ForgotPasswordRequest;
import com.example.HotelBookingSystem.dto.JwtResponse;
import com.example.HotelBookingSystem.dto.MessageResponse;
import com.example.HotelBookingSystem.dto.ResetPasswordRequest;
import com.example.HotelBookingSystem.dto.SigninRequest;
import com.example.HotelBookingSystem.dto.SignupRequest;
import com.example.HotelBookingSystem.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/signin")
    @RateLimiter(name = "api")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody SigninRequest signinRequest) {
        return ResponseEntity.ok(authService.authenticateUser(signinRequest));
    }

    @PostMapping("/signup")
    @RateLimiter(name = "api")
    public ResponseEntity<MessageResponse> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        return ResponseEntity.ok(authService.registerUser(signUpRequest));
    }

    @PostMapping("/forgot-password")
    @RateLimiter(name = "api")
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return ResponseEntity.ok(authService.forgotPassword(request));
    }

    @PostMapping("/reset-password")
    @RateLimiter(name = "api")
    public ResponseEntity<MessageResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(authService.resetPassword(request));
    }
}
