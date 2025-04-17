import express from 'express'
import { Transaction } from 'sequelize'
import sequelize from '../config/database'
import {
  Listing,
  User,
  HouseListing,
  SubleaseListing,
  SavedListing,
} from '../models'

const router = express.Router()

// Get all listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.findAll({
      include: [
        {
          model: User,
          attributes: [
            'user_id',
            'username',
            'email',
            'phone_number',
            'profile_picture',
          ],
        },
        {
          model: HouseListing,
          attributes: ['house_listing_id'],
        },
        {
          model: SubleaseListing,
          attributes: ['sublease_listing_id', 'sublease_reason'],
        },
      ],
    })

    res.json(
      listings.map((listing) => {
        const plainListing = listing.get({ plain: true })
        return {
          listingId: plainListing.listing_id,
          userId: plainListing.user_id,
          title: plainListing.title,
          description: plainListing.description,
          propertyType: plainListing.property_type,
          location: plainListing.location,
          rentPrice: plainListing.rent_price,
          leaseDuration: plainListing.lease_duration,
          availTimeStart: plainListing.avail_time_start,
          availTimeEnd: plainListing.avail_time_end,
          image: plainListing.image,
          isSublease: !!plainListing.SubleaseListing,
          subleaseReason: plainListing.SubleaseListing?.sublease_reason,
          user: plainListing.User
            ? {
                userId: plainListing.User.user_id,
                username: plainListing.User.username,
                email: plainListing.User.email,
                phoneNumber: plainListing.User.phone_number,
                profilePicture: plainListing.User.profile_picture,
              }
            : null,
        }
      })
    )
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
  const t: Transaction = await sequelize.transaction()

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
    const listing = await Listing.create(
      {
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
      },
      { transaction: t }
    )

    // Create specific listing type
    if (isSublease) {
      await SubleaseListing.create(
        {
          listing_id: listing.listing_id,
          sublease_reason: subleaseReason,
        },
        { transaction: t }
      )
    } else {
      await HouseListing.create(
        {
          listing_id: listing.listing_id,
        },
        { transaction: t }
      )
    }

    await t.commit()

    // Transform response to camelCase
    res.status(201).json({
      listingId: listing.listing_id,
      userId: listing.user_id,
      title: listing.title,
      description: listing.description,
      propertyType: listing.property_type,
      location: listing.location,
      rentPrice: listing.rent_price,
      leaseDuration: listing.lease_duration,
      availTimeStart: listing.avail_time_start,
      availTimeEnd: listing.avail_time_end,
      image: listing.image,
    })
  } catch (error) {
    await t.rollback()
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

    const savedListing = await SavedListing.create({
      user_id: userId,
      listing_id: parseInt(listingId),
      saved_at: new Date(),
    })

    res.status(200).json({
      savedId: savedListing.listing_id,
      savedAt: savedListing.saved_at.toISOString(),
    })
  } catch (error) {
    console.error('Error saving listing:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to save listing',
    })
  }
})

// Get listing by ID (this should be the last route)
router.get('/:listingId', async (req, res) => {
  try {
    const { listingId } = req.params
    const listing = await Listing.findOne({
      where: { listing_id: parseInt(listingId) },
      include: [
        {
          model: User,
          attributes: [
            'user_id',
            'username',
            'email',
            'phone_number',
            'profile_picture',
          ],
        },
        {
          model: HouseListing,
          attributes: ['house_listing_id'],
        },
        {
          model: SubleaseListing,
          attributes: ['sublease_listing_id', 'sublease_reason'],
        },
      ],
    })

    if (!listing) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Listing not found',
      })
    }

    const plainListing = listing.get({ plain: true })
    return res.json({
      listingId: plainListing.listing_id,
      userId: plainListing.user_id,
      title: plainListing.title,
      description: plainListing.description,
      propertyType: plainListing.property_type,
      location: plainListing.location,
      rentPrice: plainListing.rent_price,
      leaseDuration: plainListing.lease_duration,
      availTimeStart: plainListing.avail_time_start,
      availTimeEnd: plainListing.avail_time_end,
      image: plainListing.image,
      isSublease: !!plainListing.SubleaseListing,
      subleaseReason: plainListing.SubleaseListing?.sublease_reason,
      user: plainListing.User
        ? {
            userId: plainListing.User.user_id,
            username: plainListing.User.username,
            email: plainListing.User.email,
            phoneNumber: plainListing.User.phone_number,
            profilePicture: plainListing.User.profile_picture,
          }
        : null,
    })
  } catch (error) {
    console.error('Error fetching listing:', error)
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch listing',
    })
  }
})

export default router
