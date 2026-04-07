package com.example.HotelBookingSystem.repository;

import com.example.HotelBookingSystem.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);

    Optional<PasswordResetToken> findByTokenAndUsedFalse(String token);

    Optional<PasswordResetToken> findByUserUserIdAndTokenAndUsedFalse(Long userId, String token);

    void deleteByUserUserId(Long userId);

    void deleteByExpiresAtBefore(LocalDateTime cutoff);
}
