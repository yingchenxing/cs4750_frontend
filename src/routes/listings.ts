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
        const user = await getUserById(listing.userId)
        return {
          listingId: listing.listingId,
          userId: listing.userId,
          title: listing.title,
          description: listing.description,
          propertyType: listing.propertyType,
          location: listing.location,
          rentPrice: listing.rentPrice,
          leaseDuration: listing.leaseDuration,
          availTimeStart: listing.availTimeStart,
          availTimeEnd: listing.availTimeEnd,
          image: listing.image,
          user: user
            ? {
                userId: user.userId,
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber,
                profilePicture: user.profilePicture,
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
      userId,
      title,
      description,
      propertyType,
      location,
      rentPrice,
      leaseDuration,
      availTimeStart: new Date(availTimeStart),
      availTimeEnd: new Date(availTimeEnd),
      image,
    })

    // Create specific listing type
    if (isSublease) {
      await createSubleaseListing(listing.listingId, subleaseReason)
    } else {
      await createHouseListing(listing.listingId)
    }

    // Transform response to camelCase
    const response = {
      listingId: listing.listingId,
      userId: listing.userId,
      title: listing.title,
      description: listing.description,
      propertyType: listing.propertyType,
      location: listing.location,
      rentPrice: listing.rentPrice,
      leaseDuration: listing.leaseDuration,
      availTimeStart: listing.availTimeStart,
      availTimeEnd: listing.availTimeEnd,
      image: listing.image,
    }

    res.status(201).json(response)
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
