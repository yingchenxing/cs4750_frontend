import express from 'express'
import {
  createRoommateProfile,
  updateRoommateProfile,
  getRoommateProfile,
  getRoommateMatches,
} from '../models/roommate'
import { getUserById } from '../models/user'

const router = express.Router()

// Get roommate matches
router.get(
  '/matches',
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const { userId, page = 1, limit = 10 } = req.query

      if (!userId) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'userId is required',
        })
        return
      }

      const offset = (Number(page) - 1) * Number(limit)
      const matches = await getRoommateMatches(
        Number(userId),
        Number(limit),
        offset
      )

      const matchesWithUsers = await Promise.all(
        matches.map(async (match) => {
          const user = await getUserById(match.user_id)
          return {
            id: match.profile_id,
            userId: match.user_id,
            firstName: user?.username.split(' ')[0] || '',
            lastName: user?.username.split(' ')[1] || '',
            preferences: {
              smoking: match.p_smoking_habits,
              pets: match.p_pets,
              cleanliness: match.p_cleanliness_level,
            },
            bio: match.bio,
            profileImage: user?.profile_picture,
          }
        })
      )

      res.json({
        matches: matchesWithUsers,
        total: matches.length,
        page: Number(page),
        limit: Number(limit),
      })
    } catch (error) {
      console.error('Error fetching roommate matches:', error)
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch roommate matches',
      })
    }
  }
)

// Update user preferences
router.put(
  '/preferences',
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const { userId, smoking, pets, cleanliness, additionalNotes } = req.body

      if (!userId) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'userId is required',
        })
        return
      }

      const profile = await getRoommateProfile(Number(userId))
      if (!profile) {
        // Create new profile if it doesn't exist
        await createRoommateProfile({
          user_id: Number(userId),
          p_smoking_habits: smoking,
          p_pets: pets,
          p_cleanliness_level: cleanliness,
          bio: additionalNotes,
          p_gender: null,
          p_age: null,
        })
      } else {
        // Update existing profile
        await updateRoommateProfile(Number(userId), {
          p_smoking_habits: smoking,
          p_pets: pets,
          p_cleanliness_level: cleanliness,
          bio: additionalNotes,
        })
      }

      res.status(200).json({
        message: 'Preferences updated successfully',
      })
    } catch (error) {
      console.error('Error updating preferences:', error)
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update preferences',
      })
    }
  }
)

export default router
