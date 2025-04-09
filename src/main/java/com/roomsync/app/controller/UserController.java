package com.roomsync.app.controller;

import com.roomsync.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.roomsync.app.model.dto.SignupRequest;
import com.roomsync.app.model.dto.LoginRequest;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "https://cs4750.netlify.app")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
        boolean success = userService.register(request);
        return success ? ResponseEntity.ok("User registered") :
                ResponseEntity.badRequest().body("Email already exists");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        boolean success = userService.login(request);
        return success ? ResponseEntity.ok("Login successful") :
                ResponseEntity.status(401).body("Invalid credentials");
    }
}
