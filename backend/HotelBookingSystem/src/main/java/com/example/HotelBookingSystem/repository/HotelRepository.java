package com.example.HotelBookingSystem.repository;

import com.example.HotelBookingSystem.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    // Basic search filtering logic
    @Query("SELECT DISTINCT h FROM Hotel h JOIN h.address a LEFT JOIN h.amenities am " +
           "WHERE (:city = '' OR LOWER(a.city) LIKE LOWER(CONCAT('%', :city, '%'))) " +
           "AND (:rating IS NULL OR h.rating >= :rating) " +
           "AND (:amenityId IS NULL OR am.amenityId = :amenityId)")
    List<Hotel> searchHotels(@Param("city") String city, 
                             @Param("rating") Double rating, 
                             @Param("amenityId") Long amenityId);
}
