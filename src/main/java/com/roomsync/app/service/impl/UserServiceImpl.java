package com.roomsync.app.service.impl;

import com.roomsync.app.model.User;
import com.roomsync.app.repository.UserRepository;
import com.roomsync.app.model.dto.SignupRequest;
import com.roomsync.app.model.dto.LoginRequest;
import com.roomsync.app.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public boolean register(SignupRequest request) {
        if (userRepository.existsByEmail(request.email)) return false;

        User user = new User();
        user.setUsername(request.username);
        user.setEmail(request.email);
        user.setPasswordHash(passwordEncoder.encode(request.password));
        user.setPhoneNumber(request.phoneNumber);
        userRepository.save(user);
        return true;
    }

//    @Override
//    public boolean login(LoginRequest request) {
//        User user = userRepository.findByEmail(request.email);
//        return user != null && passwordEncoder.matches(request.password, user.getPasswordHash());
//    }

    @Override
    public User loginAndGetUser(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail());
        if (user != null && passwordEncoder.matches(request.password, user.getPasswordHash())) {
            return user;
        }
        return null;
    }

}
