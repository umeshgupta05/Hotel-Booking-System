package com.example.HotelBookingSystem.service;

import com.example.HotelBookingSystem.dto.PaymentRequest;
import com.example.HotelBookingSystem.dto.RazorpayOrderRequest;
import com.example.HotelBookingSystem.dto.RazorpayOrderResponse;
import com.example.HotelBookingSystem.dto.RazorpayVerifyRequest;
import com.example.HotelBookingSystem.entity.Booking;
import com.example.HotelBookingSystem.entity.Payment;
import com.example.HotelBookingSystem.repository.BookingRepository;
import com.example.HotelBookingSystem.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.apache.commons.codec.digest.HmacUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RazorpayClient razorpayClient;

    @Value("${razorpay.key.secret}")
    private String razorpaySecret;

    @Transactional
    public Payment processPayment(PaymentRequest request) {
        Optional<Booking> bookingOpt = bookingRepository.findById(request.getBookingId());
        if (bookingOpt.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }
        
        Payment payment = new Payment();
        payment.setBooking(bookingOpt.get());
        payment.setAmount(request.getAmount());
        payment.setMethod(request.getMethod());
        payment.setStatus("COMPLETED");
        
        Booking booking = bookingOpt.get();
        booking.setStatus("CONFIRMED");
        bookingRepository.save(booking);

        return paymentRepository.save(payment);
    }

    @Transactional
    public RazorpayOrderResponse createRazorpayOrder(RazorpayOrderRequest request) {
        try {
            JSONObject orderRequest = new JSONObject();
            // amount in paise
            orderRequest.put("amount", request.getAmount() * 100);
            orderRequest.put("currency", "INR"); 
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

            Order order = razorpayClient.orders.create(orderRequest);
            return new RazorpayOrderResponse(
                    order.get("id"),
                    request.getAmount() * 100, // Returning paise
                    "INR"
            );
        } catch (RazorpayException e) {
            throw new RuntimeException("Error while creating Razorpay Order: " + e.getMessage());
        }
    }

    @Transactional
    public Payment verifySignature(RazorpayVerifyRequest request) {
        try {
            // Documented verification spec: Generate HmacSHA256 signature using razorpaySecret
            String generatedSignature = new HmacUtils("HmacSHA256", razorpaySecret).hmacHex(
                    request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId()
            );

            if (!generatedSignature.equals(request.getRazorpaySignature())) {
                throw new RuntimeException("Razorpay signature verification failed");
            }
            
            // Signature applies. Update the DB booking to confirmed.
            Optional<Booking> bookingOpt = bookingRepository.findById(request.getBookingId());
            if (bookingOpt.isEmpty()) {
                throw new RuntimeException("Booking not found to confirm payment");
            }

            Booking booking = bookingOpt.get();
            booking.setStatus("CONFIRMED");
            bookingRepository.save(booking);

            Payment payment = new Payment();
            payment.setBooking(booking);
            payment.setAmount(booking.getTotalAmount());
            payment.setMethod("RAZORPAY");
            payment.setStatus("COMPLETED");
            
            return paymentRepository.save(payment);
        } catch (Exception e) {
            throw new RuntimeException("Error verifying signature: " + e.getMessage(), e);
        }
    }
}
