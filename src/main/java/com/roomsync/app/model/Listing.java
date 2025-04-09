package com.roomsync.app.model;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
public class Listing {
    @Id
    private Long listingId;

    @ManyToOne
    @JoinColumn(name = "user")
    private User user;

    private String title;
    private String description;
    private String propertyType;
    private String location;
    private BigDecimal rentPrice;
    private Integer leaseDuration;
    private LocalDate availTimeStart;
    private LocalDate availTimeEnd;
}
