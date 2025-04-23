import express from 'express'
import {
  SavedListing,
  Listing,
  User,
  HouseListing,
  SubleaseListing,
} from '../models'

const router = express.Router()

// Get all saved listings for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const savedListings = await SavedListing.findAll({
      where: { user_id: parseInt(userId) },
      order: [['saved_at', 'DESC']],
      include: [
        {
          model: Listing,
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
        },
      ],
    })

    return res.json(
      savedListings.map((saved) => {
        const plainSaved = saved.get({ plain: true })
        return {
          savedId: plainSaved.saved_id,
          savedAt: plainSaved.saved_at,
          listing: plainSaved.Listing,
        }
      })
    )
  } catch (error) {
    console.error('Error fetching saved listings:', error)
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch saved listings',
    })
  }
})

// Get a specific saved listing by listingId and userId
router.get('/listing/:listingId/user/:userId', async (req, res) => {
  try {
    const { listingId, userId } = req.params
    const savedListing = await SavedListing.findOne({
      where: {
        listing_id: parseInt(listingId),
        user_id: parseInt(userId),
      },
    })

    if (!savedListing) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Saved listing not found',
      })
    }

    const plainSaved = savedListing.get({ plain: true })
    return res.json({
      savedId: plainSaved.saved_id,
      savedAt: plainSaved.saved_at,
      listingId: plainSaved.listing_id,
    })
  } catch (error) {
    console.error('Error fetching saved listing:', error)
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch saved listing',
    })
  }
})

// Save a listing
router.post('/', async (req, res) => {
  try {
    const { userId, listingId } = req.body

    // Check if already saved
    const existingSave = await SavedListing.findOne({
      where: {
        user_id: userId,
        listing_id: listingId,
      },
    })

    if (existingSave) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Listing is already saved',
      })
    }

    const savedListing = await SavedListing.create({
      user_id: userId,
      listing_id: listingId,
      saved_at: new Date(),
    })

    return res.status(201).json({
      savedId: savedListing.saved_id,
      userId: savedListing.user_id,
      listingId: savedListing.listing_id,
      savedAt: savedListing.saved_at,
    })
  } catch (error) {
    console.error('Error saving listing:', error)
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to save listing',
    })
  }
})

// Delete a saved listing
router.delete('/:savedId', async (req, res) => {
  try {
    const { savedId } = req.params

    const deleted = await SavedListing.destroy({
      where: { saved_id: parseInt(savedId) },
    })

    if (!deleted) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Saved listing not found',
      })
    }

    return res.status(200).json({
      message: 'Saved listing deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting saved listing:', error)
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete saved listing',
    })
  }
})

export default router
