package com.example.HotelBookingSystem.service;

import com.example.HotelBookingSystem.dto.ForgotPasswordRequest;
import com.example.HotelBookingSystem.dto.JwtResponse;
import com.example.HotelBookingSystem.dto.MessageResponse;
import com.example.HotelBookingSystem.dto.ResetPasswordRequest;
import com.example.HotelBookingSystem.dto.SigninRequest;
import com.example.HotelBookingSystem.dto.SignupRequest;
import com.example.HotelBookingSystem.entity.Hotel;
import com.example.HotelBookingSystem.entity.PasswordResetToken;
import com.example.HotelBookingSystem.entity.User;
import com.example.HotelBookingSystem.repository.HotelRepository;
import com.example.HotelBookingSystem.repository.PasswordResetTokenRepository;
import com.example.HotelBookingSystem.repository.UserRepository;
import com.example.HotelBookingSystem.security.JwtUtils;
import com.example.HotelBookingSystem.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Objects;

@Service
@Transactional(readOnly = true)
public class AuthService {
    private static final int RESET_TOKEN_EXPIRY_MINUTES = 30;
    private static final SecureRandom RANDOM = new SecureRandom();

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    HotelRepository hotelRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    EmailNotificationService emailNotificationService;

    @Autowired
    JwtUtils jwtUtils;

    public JwtResponse authenticateUser(SigninRequest signinRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(signinRequest.getEmail(), signinRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    Long currentUserId = Objects.requireNonNull(userDetails.getId(), "Authenticated user ID is required");
    Long managedHotelId = userRepository.findById(currentUserId)
        .map(user -> user.getManagedHotel() != null ? user.getManagedHotel().getHotelId() : null)
        .orElse(null);

        return new JwtResponse(jwt,
        currentUserId,
                userDetails.getName(),
                userDetails.getEmail(),
        userDetails.getAuthorities().iterator().next().getAuthority(),
        managedHotelId);
    }

    @Transactional
    public MessageResponse registerUser(SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail().trim().toLowerCase());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));

        String requestedRole = normalizeRole(signUpRequest.getRole());
        if ("ROLE_ADMIN".equals(requestedRole)) {
            Long hotelId = Objects.requireNonNull(signUpRequest.getHotelId(), "hotelId is required for admin signup");
            Hotel managedHotel = hotelRepository.findById(hotelId)
                    .orElseThrow(() -> new RuntimeException("Selected hotel not found."));

            if (userRepository.existsByManagedHotelHotelIdAndRole(hotelId, "ROLE_ADMIN")) {
                throw new RuntimeException("Selected hotel already has an admin account.");
            }

            user.setRole("ROLE_ADMIN");
            user.setManagedHotel(managedHotel);
        } else {
            user.setRole("ROLE_USER");
            user.setManagedHotel(null);
        }

        userRepository.save(user);

        return new MessageResponse("User registered successfully!");
    }

    @Transactional
    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        // Remove old expired tokens opportunistically.
        passwordResetTokenRepository.deleteByExpiresAtBefore(LocalDateTime.now());

        userRepository.findByEmail(normalizedEmail).ifPresent(user -> {
            passwordResetTokenRepository.deleteByUserUserId(user.getUserId());

            String otpCode = generateUniqueOtp();

            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setToken(otpCode);
            resetToken.setUser(user);
            resetToken.setExpiresAt(LocalDateTime.now().plusMinutes(RESET_TOKEN_EXPIRY_MINUTES));
            resetToken.setUsed(false);
            passwordResetTokenRepository.save(resetToken);

            emailNotificationService.sendPasswordResetOtpEmail(user.getEmail(), user.getName(), otpCode);
        });

        return new MessageResponse("If an account exists for this email, an OTP has been sent.");
    }

    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        String otpCode = request.getOtp().trim();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("Invalid email or OTP."));

        PasswordResetToken resetToken = passwordResetTokenRepository
                .findByUserUserIdAndTokenAndUsedFalse(user.getUserId(), otpCode)
                .orElseThrow(() -> new RuntimeException("Invalid email or OTP."));

        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP is expired. Please request a new one.");
        }

        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        return new MessageResponse("Password reset successful. Please sign in with your new password.");
    }

    private String generateUniqueOtp() {
        for (int attempts = 0; attempts < 8; attempts++) {
            String otpCode = String.format("%06d", RANDOM.nextInt(1_000_000));
            if (passwordResetTokenRepository.findByTokenAndUsedFalse(otpCode).isEmpty()) {
                return otpCode;
            }
        }
        throw new RuntimeException("Unable to generate OTP. Please try again.");
    }

    private String normalizeRole(String role) {
        if (role == null) {
            return "ROLE_USER";
        }

        String normalized = role.trim().toUpperCase(Locale.ROOT);
        if ("ADMIN".equals(normalized) || "ROLE_ADMIN".equals(normalized)) {
            return "ROLE_ADMIN";
        }
        return "ROLE_USER";
    }
}
