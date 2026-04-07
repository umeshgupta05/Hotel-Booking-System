package com.example.HotelBookingSystem.repository;

import com.example.HotelBookingSystem.entity.Room;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByHotelHotelId(Long hotelId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM Room r WHERE r.roomId = :roomId")
    Optional<Room> findByIdForUpdate(@Param("roomId") Long roomId);

    // Find available rooms based on hotel and requested dates
    @Query("SELECT r FROM Room r WHERE r.hotel.hotelId = :hotelId AND r.availability = true AND r.roomId NOT IN " +
           "(SELECT b.room.roomId FROM Booking b WHERE b.hotel.hotelId = :hotelId AND " +
           "((b.status = 'CONFIRMED') OR (b.status = 'PENDING_PAYMENT' AND b.lockExpiresAt > CURRENT_TIMESTAMP)) AND " +
           "(b.checkIn < :checkOut AND b.checkOut > :checkIn))")
    List<Room> findAvailableRooms(@Param("hotelId") Long hotelId, 
                                  @Param("checkIn") LocalDate checkIn, 
                                  @Param("checkOut") LocalDate checkOut);
}
