package com.example.HotelBookingSystem.service;

import com.example.HotelBookingSystem.entity.Hotel;
import com.example.HotelBookingSystem.repository.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class HotelService {
    @Autowired
    private HotelRepository hotelRepository;

    @Cacheable("hotels")
    public List<Hotel> searchHotels(String city, Double rating, Long amenityId) {
        String cityFilter = city == null ? "" : city;
        return hotelRepository.searchHotels(cityFilter, rating, amenityId);
    }

    public Hotel getHotelById(Long id) {
        return hotelRepository.findById(id).orElseThrow(() -> new RuntimeException("Hotel not found"));
    }
}
