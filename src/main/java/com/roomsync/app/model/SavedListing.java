package com.roomsync.app.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
public class SavedListing {
    @Id
    private Long savedId;

    @ManyToOne
    @JoinColumn(name = "user")
    private User user;

    @ManyToOne
    @JoinColumn(name = "listing")
    private Listing listing;

    private LocalDateTime savedAt;
}
