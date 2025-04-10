package com.roomsync.app.repository;

import com.roomsync.app.model.Listing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface ListingRepository extends JpaRepository<Listing, Long> {
    List<Listing> findByUserUserId(Long userId);
}

