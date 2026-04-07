package com.example.HotelBookingSystem.service;

import com.example.HotelBookingSystem.entity.Notification;
import com.example.HotelBookingSystem.entity.User;
import com.example.HotelBookingSystem.repository.NotificationRepository;
import com.example.HotelBookingSystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    public User getProfile(Long userId) {
        return userRepository.findById(userId).orElseThrow();
    }

    public List<Notification> getNotifications(Long userId) {
        return notificationRepository.findByUserUserId(userId);
    }
}
