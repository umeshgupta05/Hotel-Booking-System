package com.example.HotelBookingSystem.service;

import com.example.HotelBookingSystem.entity.Booking;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class EmailNotificationService {

    private static final Logger log = LoggerFactory.getLogger(EmailNotificationService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromAddress;

    public void sendBookingCreatedEmail(Booking booking) {
        if (booking == null || booking.getUser() == null || !StringUtils.hasText(booking.getUser().getEmail())) {
            log.warn("Skipping booking email: booking or recipient email missing");
            return;
        }

        String recipient = booking.getUser().getEmail();
        String guestName = booking.getUser().getName();
        String hotelName = booking.getHotel() != null ? booking.getHotel().getName() : "Your selected hotel";
        String roomCategory = booking.getRoom() != null && booking.getRoom().getRoomCategory() != null
                ? booking.getRoom().getRoomCategory().getName()
                : "Room";

        SimpleMailMessage message = new SimpleMailMessage();
        if (StringUtils.hasText(fromAddress)) {
            message.setFrom(fromAddress);
        }
        message.setTo(recipient);
        message.setSubject("Booking Received - LuxeStay #" + booking.getBookingId());
        message.setText(buildBookingCreatedBody(booking, guestName, hotelName, roomCategory));

        try {
            mailSender.send(message);
            log.info("Booking confirmation email sent for bookingId={} to {}", booking.getBookingId(), recipient);
        } catch (Exception ex) {
            // Booking should not fail because of email transport issues.
            log.error("Failed to send booking confirmation email for bookingId={}: {}",
                    booking.getBookingId(), ex.getMessage());
        }
    }

    private String buildBookingCreatedBody(Booking booking, String guestName, String hotelName, String roomCategory) {
        String displayName = StringUtils.hasText(guestName) ? guestName : "Guest";
        return "Hi " + displayName + ",\n\n"
                + "Your booking request has been received successfully.\n\n"
                + "Booking ID: " + booking.getBookingId() + "\n"
                + "Hotel: " + hotelName + "\n"
                + "Room Type: " + roomCategory + "\n"
                + "Check-in: " + booking.getCheckIn() + "\n"
                + "Check-out: " + booking.getCheckOut() + "\n"
                + "Total Amount: INR " + booking.getTotalAmount() + "\n"
                + "Status: " + booking.getStatus() + "\n\n"
                + "Thank you for choosing LuxeStay.\n";
    }

    public void sendPasswordResetOtpEmail(String recipient, String userName, String otpCode) {
        if (!StringUtils.hasText(recipient) || !StringUtils.hasText(otpCode)) {
            log.warn("Skipping password reset email: recipient or otp missing");
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        if (StringUtils.hasText(fromAddress)) {
            message.setFrom(fromAddress);
        }
        message.setTo(recipient);
        message.setSubject("Your LuxeStay Password Reset OTP");
        message.setText(buildPasswordResetOtpBody(userName, otpCode));

        try {
            mailSender.send(message);
            log.info("Password reset email sent to {}", recipient);
        } catch (Exception ex) {
            log.error("Failed to send password reset email to {}: {}", recipient, ex.getMessage());
        }
    }

    private String buildPasswordResetOtpBody(String userName, String otpCode) {
        String displayName = StringUtils.hasText(userName) ? userName : "Guest";
        return "Hi " + displayName + ",\n\n"
                + "We received a request to reset your LuxeStay account password.\n\n"
                + "Use this OTP to reset your password:\n"
                + otpCode + "\n\n"
                + "This OTP will expire in 30 minutes.\n"
                + "If you did not request this, you can safely ignore this email.\n\n"
                + "LuxeStay Team\n";
    }
}
