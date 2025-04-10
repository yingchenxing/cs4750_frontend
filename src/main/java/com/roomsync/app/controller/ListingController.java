package com.roomsync.app.controller;

import com.roomsync.app.model.Listing;
import com.roomsync.app.service.ListingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.roomsync.app.model.dto.ListingRequest;
import java.util.*;

@RestController
@RequestMapping("/api/listings")
@CrossOrigin(origins = "https://cs4750.netlify.app")
public class ListingController {

    @Autowired
    private ListingService listingService;

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> addListing(@RequestBody ListingRequest request) {
        Listing listing = listingService.createListing(request);

        Map<String, Object> response = new HashMap<>();
        response.put("listing_id", listing.getListing_id());
        response.put("title", listing.getTitle());
        response.put("location", listing.getLocation());
        response.put("description", listing.getDescription());
        response.put("rent_price", listing.getRentPrice());
        response.put("lease_duration", listing.getLeaseDuration());
        response.put("property_type", listing.getPropertyType());
        response.put("image", listing.getImage());

        return ResponseEntity.ok(response);
    }


    @GetMapping
    public List<Listing> getAllListings() {
        return listingService.getAllListings();
    }
}
