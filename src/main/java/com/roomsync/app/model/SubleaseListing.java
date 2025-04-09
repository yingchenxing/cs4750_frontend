package com.roomsync.app.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
@Entity
public class SubleaseListing {
    @Id
    private Long subleaseListingId;

    @ManyToOne
    @JoinColumn(name = "listing")
    private Listing listing;

    private String subleaseReason;
}
