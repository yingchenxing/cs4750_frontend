package com.roomsync.app.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
@Entity
public class HouseListing {
    @Id
    private Long houseListingId;

    @ManyToOne
    @JoinColumn(name = "listing")
    private Listing listing;
}
