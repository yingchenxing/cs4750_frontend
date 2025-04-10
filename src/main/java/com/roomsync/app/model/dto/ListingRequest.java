package com.roomsync.app.model.dto;

import com.roomsync.app.model.User;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ListingRequest {
    private String title;
    private String description;
    private String propertyType;
    private String location;
    private BigDecimal rentPrice;
    private Integer leaseDuration;
    private LocalDate availTimeStart;
    private LocalDate availTimeEnd;
    private Long userId;

    private Long listing_id;

    private String image;

    private String subleaseReason;
    private Boolean isSublease;
}
