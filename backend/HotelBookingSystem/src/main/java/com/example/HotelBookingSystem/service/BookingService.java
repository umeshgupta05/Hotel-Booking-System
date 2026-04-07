package com.example.HotelBookingSystem.service;

import com.example.HotelBookingSystem.dto.BookingRequest;
import com.example.HotelBookingSystem.entity.Booking;
import com.example.HotelBookingSystem.entity.Hotel;
import com.example.HotelBookingSystem.entity.Room;
import com.example.HotelBookingSystem.entity.User;
import com.example.HotelBookingSystem.repository.BookingRepository;
import com.example.HotelBookingSystem.repository.HotelRepository;
import com.example.HotelBookingSystem.repository.RoomRepository;
import com.example.HotelBookingSystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private HotelRepository hotelRepository;
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private EmailNotificationService emailNotificationService;

    @Transactional
    public Booking createBooking(Long userId, BookingRequest request) {
        User user = userRepository.findById(userId).orElseThrow();
        Hotel hotel = hotelRepository.findById(request.getHotelId()).orElseThrow();
        Room room = roomRepository.findById(request.getRoomId()).orElseThrow();

        if(!room.getHotel().getHotelId().equals(hotel.getHotelId())) {
            throw new RuntimeException("Room does not belong to hotel");
        }

        long days = ChronoUnit.DAYS.between(request.getCheckIn(), request.getCheckOut());
        if(days <= 0) throw new RuntimeException("Invalid dates");

        double totalAmount = room.getRoomCategory().getBasePrice() * days;

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setHotel(hotel);
        booking.setRoom(room);
        booking.setCheckIn(request.getCheckIn());
        booking.setCheckOut(request.getCheckOut());
        booking.setStatus("PENDING");
        booking.setTotalAmount(totalAmount);

        Booking savedBooking = bookingRepository.save(booking);
        emailNotificationService.sendBookingCreatedEmail(savedBooking);
        return savedBooking;
    }

    public List<Booking> getUserHistory(Long userId) {
        return bookingRepository.findByUserUserId(userId);
    }

    public Booking getBooking(Long bookingId) {
        return bookingRepository.findById(bookingId).orElseThrow();
    }

    @Transactional
    public Booking cancelBooking(Long bookingId) {
        Booking booking = getBooking(bookingId);
        booking.setStatus("CANCELLED");
        return bookingRepository.save(booking);
    }
}
