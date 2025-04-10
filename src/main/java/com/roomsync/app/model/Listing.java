package com.roomsync.app.model;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "listings")
@Inheritance(strategy = InheritanceType.JOINED)
public class Listing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long listing_id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String title;
    private String description;

    @Column(name = "property_type", nullable = false)
    private String propertyType;

    private String location;

    @Column(name = "rent_price", nullable = false)
    private BigDecimal rentPrice;

    @Column(name = "lease_duration", nullable = false)
    private Integer leaseDuration;

    @Column(name = "avail_time_start", nullable = false)
    private LocalDate availTimeStart;

    @Column(name = "avail_time_end", nullable = false)
    private LocalDate availTimeEnd;

    private String image;
}
