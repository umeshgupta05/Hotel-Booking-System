package com.example.HotelBookingSystem.service;

import com.example.HotelBookingSystem.dto.AdminAmenityUpdateRequest;
import com.example.HotelBookingSystem.dto.AdminHotelUpdateRequest;
import com.example.HotelBookingSystem.dto.AdminRoomRequest;
import com.example.HotelBookingSystem.entity.Amenity;
import com.example.HotelBookingSystem.entity.Hotel;
import com.example.HotelBookingSystem.entity.Room;
import com.example.HotelBookingSystem.entity.RoomCategory;
import com.example.HotelBookingSystem.entity.User;
import com.example.HotelBookingSystem.repository.AmenityRepository;
import com.example.HotelBookingSystem.repository.HotelRepository;
import com.example.HotelBookingSystem.repository.RoomCategoryRepository;
import com.example.HotelBookingSystem.repository.RoomRepository;
import com.example.HotelBookingSystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@Transactional(readOnly = true)
public class AdminHotelService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomCategoryRepository roomCategoryRepository;

    @Autowired
    private AmenityRepository amenityRepository;

    public Hotel getMyHotel(Long userId) {
        return getManagedHotel(userId);
    }

    @Transactional
    public Hotel updateMyHotel(Long userId, AdminHotelUpdateRequest request) {
        Hotel hotel = getManagedHotel(userId);

        if (StringUtils.hasText(request.getName())) {
            hotel.setName(request.getName().trim());
        }
        if (StringUtils.hasText(request.getDescription())) {
            hotel.setDescription(request.getDescription().trim());
        }
        if (request.getBasePrice() != null && request.getBasePrice() > 0) {
            hotel.setBasePrice(request.getBasePrice());
        }
        if (StringUtils.hasText(request.getImageUrl())) {
            hotel.setImageUrl(request.getImageUrl().trim());
        }
        if (StringUtils.hasText(request.getContactEmail())) {
            hotel.setContactEmail(request.getContactEmail().trim().toLowerCase());
        }
        if (StringUtils.hasText(request.getContactPhone())) {
            hotel.setContactPhone(request.getContactPhone().trim());
        }

        return hotelRepository.save(hotel);
    }

    public List<Room> getMyHotelRooms(Long userId) {
        Hotel hotel = getManagedHotel(userId);
        return roomRepository.findByHotelHotelId(hotel.getHotelId());
    }

    @Transactional
    public Room createRoom(Long userId, AdminRoomRequest request) {
        Hotel hotel = getManagedHotel(userId);
        RoomCategory category = roomCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Room category not found."));

        Room room = new Room();
        room.setHotel(hotel);
        room.setRoomNumber(request.getRoomNumber().trim());
        room.setRoomCategory(category);
        room.setAvailability(request.getAvailability());

        return roomRepository.save(room);
    }

    @Transactional
    public Room updateRoom(Long userId, Long roomId, AdminRoomRequest request) {
        Hotel hotel = getManagedHotel(userId);
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found."));

        if (!room.getHotel().getHotelId().equals(hotel.getHotelId())) {
            throw new RuntimeException("You are not authorized to modify this room.");
        }

        RoomCategory category = roomCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Room category not found."));

        room.setRoomNumber(request.getRoomNumber().trim());
        room.setRoomCategory(category);
        room.setAvailability(request.getAvailability());

        return roomRepository.save(room);
    }

    @Transactional
    public void deleteRoom(Long userId, Long roomId) {
        Hotel hotel = getManagedHotel(userId);
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found."));

        if (!room.getHotel().getHotelId().equals(hotel.getHotelId())) {
            throw new RuntimeException("You are not authorized to delete this room.");
        }

        roomRepository.delete(room);
    }

    public List<Amenity> getAllAmenities() {
        return amenityRepository.findAll();
    }

    public List<RoomCategory> getAllRoomCategories() {
        return roomCategoryRepository.findAll();
    }

    @Transactional
    public Hotel updateMyHotelAmenities(Long userId, AdminAmenityUpdateRequest request) {
        Hotel hotel = getManagedHotel(userId);
        Set<Amenity> amenities = new HashSet<>();

        if (request.getAmenityIds() != null) {
            for (Long amenityId : request.getAmenityIds()) {
                Amenity amenity = amenityRepository.findById(amenityId)
                        .orElseThrow(() -> new RuntimeException("Amenity not found: " + amenityId));
                amenities.add(amenity);
            }
        }

        hotel.setAmenities(amenities);
        return hotelRepository.save(hotel);
    }

    private Hotel getManagedHotel(Long userId) {
        Long safeUserId = Objects.requireNonNull(userId, "userId is required");
        User user = userRepository.findById(safeUserId)
                .orElseThrow(() -> new RuntimeException("Admin user not found."));

        if (!"ROLE_ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Only admin users can manage hotels.");
        }

        Hotel managedHotel = user.getManagedHotel();
        if (managedHotel == null) {
            throw new RuntimeException("No hotel is assigned to this admin account.");
        }

        return managedHotel;
    }
}
