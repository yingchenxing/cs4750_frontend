package com.roomsync.app.service.impl;

import com.roomsync.app.model.HouseListing;
import com.roomsync.app.model.User;
import com.roomsync.app.repository.ListingRepository;
import com.roomsync.app.repository.UserRepository;
import com.roomsync.app.model.Listing;
import com.roomsync.app.model.dto.ListingRequest;
import com.roomsync.app.model.SubleaseListing;



import com.roomsync.app.service.ListingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ListingServiceImpl implements ListingService {

    @Autowired
    private ListingRepository listingRepository;

    @Autowired
    private UserRepository userRepository;


    @Override
    public Listing createListing(ListingRequest request) {
        Listing listing;

        if (Boolean.TRUE.equals(request.getIsSublease())) {
            SubleaseListing sublease = new SubleaseListing();
            sublease.setSubleaseReason(request.getSubleaseReason());
            listing = sublease;
        } else {
            listing = new HouseListing();
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        listing.setUser(user);
        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setPropertyType(request.getPropertyType());
        listing.setLocation(request.getLocation());
        listing.setRentPrice(request.getRentPrice());
        listing.setLeaseDuration(request.getLeaseDuration());
        listing.setAvailTimeStart(request.getAvailTimeStart());
        listing.setAvailTimeEnd(request.getAvailTimeEnd());
        listing.setImage(request.getImage());

        return listingRepository.save(listing);
    }


    @Override
    public List<Listing> getAllListings() {
        return listingRepository.findAll();
    }
}
