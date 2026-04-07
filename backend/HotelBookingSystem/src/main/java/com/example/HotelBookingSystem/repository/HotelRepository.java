package com.example.HotelBookingSystem.repository;

import com.example.HotelBookingSystem.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    // Search by free text token across hotel details with optional structured filters.
    @Query("SELECT DISTINCT h FROM Hotel h JOIN h.address a LEFT JOIN h.amenities am " +
           "WHERE (:q = '' OR " +
           "LOWER(h.name) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(h.description) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(a.street) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(a.city) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(a.state) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(a.country) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(a.zipCode) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(h.contactEmail) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(h.contactPhone) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(am.name) LIKE LOWER(CONCAT('%', :q, '%'))) " +
           "AND (:city = '' OR LOWER(a.city) LIKE LOWER(CONCAT('%', :city, '%'))) " +
           "AND (:rating IS NULL OR h.rating >= :rating) " +
           "AND (:amenityId IS NULL OR am.amenityId = :amenityId)")
    List<Hotel> searchHotels(@Param("q") String q,
                             @Param("city") String city,
                             @Param("rating") Double rating, 
                             @Param("amenityId") Long amenityId);
}
