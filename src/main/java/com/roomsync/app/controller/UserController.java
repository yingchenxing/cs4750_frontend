package com.roomsync.app.controller;

import com.roomsync.app.model.User;
import com.roomsync.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.roomsync.app.model.dto.SignupRequest;
import com.roomsync.app.model.dto.LoginRequest;
import java.util.*;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "https://cs4750.netlify.app")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        boolean success = userService.register(request);
        if (success) {
            Map<String, Object> response = new HashMap<>();
            response.put("email", request.getEmail());

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body("Email already exists");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userService.loginAndGetUser(request);;
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
}
