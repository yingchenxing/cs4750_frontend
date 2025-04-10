package com.roomsync.app.model.dto;


import lombok.Data;

@Data
public class SignupRequest {
    public String username;
    public String email;
    public String password;
    public String phoneNumber;
}
