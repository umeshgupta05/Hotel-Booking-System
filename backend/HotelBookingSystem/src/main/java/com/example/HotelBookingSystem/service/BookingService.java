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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@Transactional(readOnly = true)
public class BookingService {
    private static final String STATUS_PENDING_PAYMENT = "PENDING_PAYMENT";
    private static final String STATUS_CANCELLED = "CANCELLED";
    private static final String STATUS_EXPIRED = "EXPIRED";
    private static final int PAYMENT_WINDOW_MINUTES = 5;
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "bookingId", "checkIn", "checkOut", "status", "totalAmount", "lockExpiresAt"
    );

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
        expirePendingLocks();

        Long safeUserId = Objects.requireNonNull(userId, "userId is required");
        Long safeHotelId = Objects.requireNonNull(request.getHotelId(), "hotelId is required");
        Long safeRoomId = Objects.requireNonNull(request.getRoomId(), "roomId is required");
        LocalDate checkIn = Objects.requireNonNull(request.getCheckIn(), "checkIn is required");
        LocalDate checkOut = Objects.requireNonNull(request.getCheckOut(), "checkOut is required");

        User user = userRepository.findById(safeUserId)
                .orElseThrow(() -> new RuntimeException("User not found."));
        Hotel hotel = hotelRepository.findById(safeHotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found."));
        Room room = roomRepository.findByIdForUpdate(safeRoomId)
                .orElseThrow(() -> new RuntimeException("Room not found."));

        if (!room.getHotel().getHotelId().equals(hotel.getHotelId())) {
            throw new RuntimeException("Room does not belong to hotel");
        }

        if (!Boolean.TRUE.equals(room.getAvailability())) {
            throw new RuntimeException("Room is currently unavailable");
        }

        long days = ChronoUnit.DAYS.between(checkIn, checkOut);
        if (days <= 0) {
            throw new RuntimeException("Invalid dates");
        }

        LocalDateTime now = LocalDateTime.now();
        boolean roomBlocked = bookingRepository.existsBlockingBooking(safeRoomId, checkIn, checkOut, now);
        if (roomBlocked) {
            throw new RuntimeException("Room is currently locked or already booked for selected dates.");
        }

        double totalAmount = room.getRoomCategory().getBasePrice() * days;

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setHotel(hotel);
        booking.setRoom(room);
        booking.setCheckIn(checkIn);
        booking.setCheckOut(checkOut);
        booking.setStatus(STATUS_PENDING_PAYMENT);
        booking.setTotalAmount(totalAmount);
        booking.setLockExpiresAt(now.plusMinutes(PAYMENT_WINDOW_MINUTES));

        Booking savedBooking = bookingRepository.save(booking);
        emailNotificationService.sendBookingCreatedEmail(savedBooking);
        return savedBooking;
    }

    public List<Booking> getUserHistory(Long userId) {
        Long safeUserId = Objects.requireNonNull(userId, "userId is required");
        return bookingRepository.findByUserUserId(safeUserId);
    }

    public Page<Booking> getUserHistoryPaged(Long userId, int page, int size, String sortBy, String sortDir) {
        Long safeUserId = Objects.requireNonNull(userId, "userId is required");
        int safePage = Math.max(0, page);
        int safeSize = Math.min(50, Math.max(1, size));

        String requestedSort = sortBy == null ? "bookingId" : sortBy;
        String safeSortBy = ALLOWED_SORT_FIELDS.contains(requestedSort) ? requestedSort : "bookingId";

        Sort sort = "asc".equalsIgnoreCase(sortDir)
                ? Sort.by(safeSortBy).ascending()
                : Sort.by(safeSortBy).descending();
        Pageable pageable = PageRequest.of(safePage, safeSize, sort);

        return bookingRepository.findByUserUserId(safeUserId, pageable);
    }

    public Booking getBooking(Long bookingId) {
        Long safeBookingId = Objects.requireNonNull(bookingId, "bookingId is required");
        return bookingRepository.findById(safeBookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found."));
    }

    @Transactional
    public Booking cancelBooking(Long bookingId) {
        Long safeBookingId = Objects.requireNonNull(bookingId, "bookingId is required");
        Booking booking = bookingRepository.findByIdForUpdate(safeBookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found."));

        if (STATUS_EXPIRED.equals(booking.getStatus()) || STATUS_CANCELLED.equals(booking.getStatus())) {
            return booking;
        }

        booking.setStatus(STATUS_CANCELLED);
        booking.setLockExpiresAt(null);
        return bookingRepository.save(booking);
    }

    @Transactional
    public int expirePendingLocks() {
        List<Booking> expiredBookings = bookingRepository.findByStatusAndLockExpiresAtBefore(
                STATUS_PENDING_PAYMENT,
                LocalDateTime.now()
        );

        if (expiredBookings.isEmpty()) {
            return 0;
        }

        for (Booking booking : expiredBookings) {
            booking.setStatus(STATUS_EXPIRED);
            booking.setLockExpiresAt(null);
        }

        bookingRepository.saveAll(expiredBookings);
        return expiredBookings.size();
    }

    @Scheduled(fixedDelayString = "60000")
    @Transactional
    public void expirePendingLocksJob() {
        expirePendingLocks();
    }
}
