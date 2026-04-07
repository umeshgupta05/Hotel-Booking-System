package com.example.HotelBookingSystem.service;

import com.example.HotelBookingSystem.dto.PaymentRequest;
import com.example.HotelBookingSystem.entity.Booking;
import com.example.HotelBookingSystem.entity.Payment;
import com.example.HotelBookingSystem.repository.BookingRepository;
import com.example.HotelBookingSystem.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@Transactional(readOnly = true)
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Transactional
    public Payment processPayment(Long userId, PaymentRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
            .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized payment request");
        }

        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            throw new RuntimeException("Cannot pay for a cancelled booking");
        }

        Payment existing = paymentRepository.findByBookingBookingId(booking.getBookingId()).orElse(null);
        if (existing != null) {
            return existing;
        }

        double amount = request.getAmount() != null ? request.getAmount() : booking.getTotalAmount();
        if (amount <= 0) {
            throw new RuntimeException("Invalid payment amount");
        }

        String method = StringUtils.hasText(request.getMethod()) ? request.getMethod() : "PAY_AT_HOTEL";
        
        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setAmount(amount);
        payment.setMethod(method);
        payment.setStatus("SUCCESS");
        
        payment = paymentRepository.save(payment);
        
        booking.setStatus("CONFIRMED");
        bookingRepository.save(booking);

        return payment;
    }
}
