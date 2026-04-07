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

import java.time.LocalDateTime;
import java.util.Objects;

@Service
public class PaymentService {
    private static final String STATUS_PENDING_PAYMENT = "PENDING_PAYMENT";
    private static final String STATUS_CONFIRMED = "CONFIRMED";
    private static final String STATUS_CANCELLED = "CANCELLED";
    private static final String STATUS_EXPIRED = "EXPIRED";


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
        Long bookingId = Objects.requireNonNull(request.getBookingId(), "bookingId is required");
        Booking booking = bookingRepository.findByIdForUpdate(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (STATUS_CANCELLED.equals(booking.getStatus())) {
            throw new RuntimeException("Booking is cancelled.");
        }

        if (STATUS_EXPIRED.equals(booking.getStatus())) {
            throw new RuntimeException("Booking lock expired. Please create a new booking.");
        }

        if (STATUS_CONFIRMED.equals(booking.getStatus())) {
            return paymentRepository.findByBookingBookingId(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking already confirmed."));
        }

        validateAndExpireIfWindowClosed(booking);

        booking.setStatus(STATUS_CONFIRMED);
        booking.setLockExpiresAt(null);
        bookingRepository.save(booking);

        Payment payment = paymentRepository.findByBookingBookingId(bookingId).orElseGet(Payment::new);
        payment.setBooking(booking);
        payment.setAmount(request.getAmount() != null ? request.getAmount() : booking.getTotalAmount());
        payment.setMethod(request.getMethod() != null ? request.getMethod() : "PAY_AT_HOTEL");
        payment.setStatus("COMPLETED");

        return paymentRepository.save(payment);
    }

    @Transactional
    public RazorpayOrderResponse createRazorpayOrder(RazorpayOrderRequest request) {
        try {
            Long bookingId = Objects.requireNonNull(request.getBookingId(), "bookingId is required");
            Booking booking = bookingRepository.findByIdForUpdate(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            if (STATUS_CANCELLED.equals(booking.getStatus())) {
                throw new RuntimeException("Booking is cancelled.");
            }

            if (STATUS_EXPIRED.equals(booking.getStatus())) {
                throw new RuntimeException("Booking lock expired. Please create a new booking.");
            }

            if (STATUS_CONFIRMED.equals(booking.getStatus())) {
                throw new RuntimeException("Booking already confirmed.");
            }

            validateAndExpireIfWindowClosed(booking);

            double amountRupees = booking.getTotalAmount() != null
                    ? booking.getTotalAmount()
                    : (request.getAmount() != null ? request.getAmount() : 0L);
            long amountPaise = Math.round(amountRupees * 100.0);
            if (amountPaise <= 0) {
                throw new RuntimeException("Invalid payment amount.");
            }

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountPaise);
            orderRequest.put("currency", request.getCurrency() != null ? request.getCurrency() : "INR");
            orderRequest.put("receipt", "booking_" + bookingId + "_" + System.currentTimeMillis());

            Order order = razorpayClient.orders.create(orderRequest);
            return new RazorpayOrderResponse(
                    order.get("id"),
                    amountPaise,
                    request.getCurrency() != null ? request.getCurrency() : "INR"
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

            Long bookingId = Objects.requireNonNull(request.getBookingId(), "bookingId is required");
            Booking booking = bookingRepository.findByIdForUpdate(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found to confirm payment"));

            if (STATUS_CANCELLED.equals(booking.getStatus())) {
                throw new RuntimeException("Booking is cancelled.");
            }

            if (STATUS_EXPIRED.equals(booking.getStatus())) {
                throw new RuntimeException("Booking lock expired. Please create a new booking.");
            }

            if (!STATUS_CONFIRMED.equals(booking.getStatus())) {
                validateAndExpireIfWindowClosed(booking);
                booking.setStatus(STATUS_CONFIRMED);
                booking.setLockExpiresAt(null);
            }
            bookingRepository.save(booking);

            Payment payment = paymentRepository.findByBookingBookingId(bookingId).orElseGet(Payment::new);
            payment.setBooking(booking);
            payment.setAmount(booking.getTotalAmount());
            payment.setMethod("RAZORPAY");
            payment.setStatus("COMPLETED");

            return paymentRepository.save(payment);
        } catch (Exception e) {
            throw new RuntimeException("Error verifying signature: " + e.getMessage(), e);
        }
    }

    private void validateAndExpireIfWindowClosed(Booking booking) {
        if (!STATUS_PENDING_PAYMENT.equals(booking.getStatus())) {
            throw new RuntimeException("Booking is not awaiting payment.");
        }

        if (booking.getLockExpiresAt() != null && booking.getLockExpiresAt().isBefore(LocalDateTime.now())) {
            booking.setStatus(STATUS_EXPIRED);
            booking.setLockExpiresAt(null);
            bookingRepository.save(booking);
            throw new RuntimeException("Payment window expired. Please create a new booking.");
        }
    }
}
