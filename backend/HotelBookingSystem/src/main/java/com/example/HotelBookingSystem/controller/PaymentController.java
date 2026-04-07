package com.example.HotelBookingSystem.controller;

import com.example.HotelBookingSystem.dto.PaymentRequest;
import com.example.HotelBookingSystem.dto.RazorpayOrderRequest;
import com.example.HotelBookingSystem.dto.RazorpayOrderResponse;
import com.example.HotelBookingSystem.dto.RazorpayVerifyRequest;
import com.example.HotelBookingSystem.entity.Payment;
import com.example.HotelBookingSystem.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/process")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Payment> processPayment(@RequestBody PaymentRequest request) {
        return ResponseEntity.ok(paymentService.processPayment(request));
    }

    @PostMapping("/create-order")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<RazorpayOrderResponse> createRazorpayOrder(@RequestBody RazorpayOrderRequest request) {
        return ResponseEntity.ok(paymentService.createRazorpayOrder(request));
    }

    @PostMapping("/verify-signature")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> verifySignature(@RequestBody RazorpayVerifyRequest request) {
        try {
            Payment payment = paymentService.verifySignature(request);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
