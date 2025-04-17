import express from 'express'
import { PropertyReview, User } from '../models'

const router = express.Router()

// Get reviews for a listing
router.get('/listing/:listingId', async (req, res) => {
  try {
    const { listingId } = req.params
    const reviews = await PropertyReview.findAll({
      where: { listing_id: parseInt(listingId) },
      include: [
        {
          model: User,
          attributes: ['user_id', 'username', 'profile_picture'],
        },
      ],
    })

    return res.json(
      reviews.map((review) => {
        const plainReview = review.get({ plain: true })
        return {
          reviewId: plainReview.review_id,
          listingId: plainReview.listing_id,
          rating: plainReview.rating,
          comment: plainReview.comment,
          user: plainReview.User
            ? {
                userId: plainReview.User.user_id,
                username: plainReview.User.username,
                profilePicture: plainReview.User.profile_picture,
              }
            : null,
        }
      })
    )
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch reviews',
    })
  }
})

// Create a review
router.post('/listing/:listingId', async (req, res) => {
  try {
    const { listingId } = req.params
    const { userId, rating, comment } = req.body

    // Check if user has already reviewed this listing
    const existingReview = await PropertyReview.findOne({
      where: {
        listing_id: parseInt(listingId),
        user_id: userId,
      },
    })

    if (existingReview) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'You have already reviewed this listing',
      })
    }

    const review = await PropertyReview.create({
      listing_id: parseInt(listingId),
      user_id: userId,
      rating,
      comment,
    })

    // Fetch the created review with user data
    const reviewWithUser = await PropertyReview.findOne({
      where: { review_id: review.review_id },
      include: [
        {
          model: User,
          attributes: ['user_id', 'username', 'profile_picture'],
        },
      ],
    })

    const plainReview = reviewWithUser!.get({ plain: true })
    return res.status(201).json({
      reviewId: plainReview.review_id,
      listingId: plainReview.listing_id,
      rating: plainReview.rating,
      comment: plainReview.comment,
      user: plainReview.User
        ? {
            userId: plainReview.User.user_id,
            username: plainReview.User.username,
            profilePicture: plainReview.User.profile_picture,
          }
        : null,
    })
  } catch (error) {
    console.error('Error creating review:', error)
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create review',
    })
  }
})

// Update a review
router.put('/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params
    const { rating, comment } = req.body

    const review = await PropertyReview.findByPk(reviewId)
    if (!review) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Review not found',
      })
    }

    await review.update({
      rating,
      comment,
    })

    // Fetch the updated review with user data
    const updatedReview = await PropertyReview.findOne({
      where: { review_id: reviewId },
      include: [
        {
          model: User,
          attributes: ['user_id', 'username', 'profile_picture'],
        },
      ],
    })

    const plainReview = updatedReview!.get({ plain: true })
    return res.json({
      reviewId: plainReview.review_id,
      listingId: plainReview.listing_id,
      rating: plainReview.rating,
      comment: plainReview.comment,
      user: plainReview.User
        ? {
            userId: plainReview.User.user_id,
            username: plainReview.User.username,
            profilePicture: plainReview.User.profile_picture,
          }
        : null,
    })
  } catch (error) {
    console.error('Error updating review:', error)
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update review',
    })
  }
})

// Delete a review
router.delete('/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params
    const review = await PropertyReview.findByPk(reviewId)

    if (!review) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Review not found',
      })
    }

    await review.destroy()
    return res.status(204).send()
  } catch (error) {
    console.error('Error deleting review:', error)
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete review',
    })
  }
})

export default router
