package com.example.HotelBookingSystem.repository;

import com.example.HotelBookingSystem.entity.Booking;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserUserId(Long userId);

    Page<Booking> findByUserUserId(Long userId, Pageable pageable);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM Booking b WHERE b.bookingId = :bookingId")
    Optional<Booking> findByIdForUpdate(@Param("bookingId") Long bookingId);

    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM Booking b " +
            "WHERE b.room.roomId = :roomId AND " +
            "((b.status = 'CONFIRMED') OR (b.status = 'PENDING_PAYMENT' AND b.lockExpiresAt > :now)) AND " +
            "(b.checkIn < :checkOut AND b.checkOut > :checkIn)")
    boolean existsBlockingBooking(@Param("roomId") Long roomId,
                                  @Param("checkIn") LocalDate checkIn,
                                  @Param("checkOut") LocalDate checkOut,
                                  @Param("now") LocalDateTime now);

    List<Booking> findByStatusAndLockExpiresAtBefore(String status, LocalDateTime threshold);
}
