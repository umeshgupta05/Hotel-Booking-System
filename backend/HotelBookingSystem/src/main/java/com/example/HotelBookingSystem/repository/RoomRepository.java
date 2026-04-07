package com.example.HotelBookingSystem.repository;

import com.example.HotelBookingSystem.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByHotelHotelId(Long hotelId);

    // Find available rooms based on hotel and requested dates
    @Query("SELECT r FROM Room r WHERE r.hotel.hotelId = :hotelId AND r.availability = true AND r.roomId NOT IN " +
           "(SELECT b.room.roomId FROM Booking b WHERE b.hotel.hotelId = :hotelId AND " +
           "(b.status IS NULL OR b.status != 'CANCELLED') AND " +
           "(b.checkIn < :checkOut AND b.checkOut > :checkIn))")
    List<Room> findAvailableRooms(@Param("hotelId") Long hotelId, 
                                  @Param("checkIn") LocalDate checkIn, 
                                  @Param("checkOut") LocalDate checkOut);
}
