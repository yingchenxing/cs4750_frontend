package com.roomsync.app.service;


import com.roomsync.app.model.Listing;
import com.roomsync.app.model.dto.ListingRequest;
import java.util.*;
public interface ListingService {
    Listing createListing(ListingRequest request);
    List<Listing> getAllListings();
}
