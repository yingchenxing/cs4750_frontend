package com.roomsync.app.service;

import com.roomsync.app.model.User;
import com.roomsync.app.model.dto.LoginRequest;
import com.roomsync.app.model.dto.SignupRequest;


public interface UserService {
    boolean register(SignupRequest request);
    boolean login(LoginRequest request);
}
