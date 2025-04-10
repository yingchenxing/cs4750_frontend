package com.roomsync.app.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "sublease_listings")
public class SubleaseListing extends Listing{

    @Column(name = "sublease_reason", nullable = false)
    private String subleaseReason;
}
