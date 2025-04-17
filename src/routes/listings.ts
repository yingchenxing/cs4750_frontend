import express from 'express'
import {
  createListing,
  createHouseListing,
  createSubleaseListing,
  getAllListings,
  saveListing,
} from '../models/listing'
import { getUserById } from '../models/user'

const router = express.Router()

// Get all listings
router.get('/', async (req, res) => {
  try {
    const listings = await getAllListings()
    const listingsWithUsers = await Promise.all(
      listings.map(async (listing) => {
        const user = await getUserById(listing.user_id)
        return {
          ...listing,
          user: user
            ? {
                userId: user.user_id,
                username: user.username,
                email: user.email,
                phoneNumber: user.phone_number,
                profilePicture: user.profile_picture,
              }
            : null,
        }
      })
    )
    res.json(listingsWithUsers)
  } catch (error) {
    console.error('Error fetching listings:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch listings',
    })
  }
})

// Create new listing
router.post('/create', async (req, res) => {
  try {
    const {
      userId,
      title,
      description,
      location,
      propertyType,
      rentPrice,
      leaseDuration,
      availTimeStart,
      availTimeEnd,
      image,
      isSublease,
      subleaseReason,
    } = req.body

    // Create base listing
    const listing = await createListing({
      user_id: userId,
      title,
      description,
      property_type: propertyType,
      location,
      rent_price: rentPrice,
      lease_duration: leaseDuration,
      avail_time_start: new Date(availTimeStart),
      avail_time_end: new Date(availTimeEnd),
      image,
    })

    // Create specific listing type
    if (isSublease) {
      await createSubleaseListing(listing.listing_id, subleaseReason)
    } else {
      await createHouseListing(listing.listing_id)
    }

    res.status(201).json(listing)
  } catch (error) {
    console.error('Error creating listing:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create listing',
    })
  }
})

// Save listing
router.post('/:listingId/save', async (req, res) => {
  try {
    const { listingId } = req.params
    const { userId } = req.body

    await saveListing(userId, parseInt(listingId))
    res.status(200).json({
      savedId: listingId,
      savedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error saving listing:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to save listing',
    })
  }
})

export default router
