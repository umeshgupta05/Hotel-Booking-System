package com.example.HotelBookingSystem.service;

import com.example.HotelBookingSystem.dto.ReviewRequest;
import com.example.HotelBookingSystem.entity.Hotel;
import com.example.HotelBookingSystem.entity.Review;
import com.example.HotelBookingSystem.entity.User;
import com.example.HotelBookingSystem.repository.HotelRepository;
import com.example.HotelBookingSystem.repository.ReviewRepository;
import com.example.HotelBookingSystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Objects;

@Service
@Transactional(readOnly = true)
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private HotelRepository hotelRepository;

    @Transactional
    public Review addReview(Long userId, ReviewRequest request) {
        Long safeUserId = Objects.requireNonNull(userId, "userId is required");
        Long safeHotelId = Objects.requireNonNull(request.getHotelId(), "hotelId is required");

        User user = userRepository.findById(safeUserId)
                .orElseThrow(() -> new RuntimeException("User not found."));
        Hotel hotel = hotelRepository.findById(safeHotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found."));

        List<Review> existingReviews = reviewRepository.findByHotelHotelIdAndUserUserIdOrderByReviewIdDesc(safeHotelId, safeUserId);
        Review review = existingReviews.isEmpty() ? new Review() : existingReviews.get(0);
        review.setUser(user);
        review.setHotel(hotel);
        review.setRating(request.getRating());
        review.setComment(StringUtils.hasText(request.getComment()) ? request.getComment().trim() : null);

        Review savedReview = reviewRepository.save(review);
        refreshHotelRating(hotel);
        return savedReview;
    }

    public List<Review> getHotelReviews(Long hotelId) {
        Long safeHotelId = Objects.requireNonNull(hotelId, "hotelId is required");
        return reviewRepository.findByHotelHotelIdOrderByReviewIdDesc(safeHotelId);
    }

    @Transactional
    protected void refreshHotelRating(Hotel hotel) {
        Double averageRating = reviewRepository.findAverageRatingByHotelId(hotel.getHotelId());
        double roundedRating = averageRating == null ? 0.0 : Math.round(averageRating * 10.0) / 10.0;
        hotel.setRating(roundedRating);
        hotelRepository.save(hotel);
    }
}
