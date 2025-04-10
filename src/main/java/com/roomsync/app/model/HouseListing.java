package com.roomsync.app.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "house_listings")
public class HouseListing extends Listing{

}
