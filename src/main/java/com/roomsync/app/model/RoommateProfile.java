package com.roomsync.app.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
@Entity
public class RoommateProfile {
    @Id
    private Long profileId;

    @ManyToOne
    @JoinColumn(name = "user")
    private User user;

    private String gender;
    private String cleanlinessLevel;
    private Integer age;
    private Boolean pets;
    private Boolean smokingHabits;
    private String bio;
}
