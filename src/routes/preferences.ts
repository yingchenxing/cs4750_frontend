import express from 'express'
import { RoommateProfile, User } from '../models'

const router = express.Router()

// Create user preferences
router.post('/', async (req, res) => {
  try {
    const { userId, gender, cleanlinessLevel, age, pets, smokingHabits, bio } =
      req.body

    // Check if profile already exists
    const existingProfile = await RoommateProfile.findOne({
      where: { user_id: parseInt(userId) },
    })

    if (existingProfile) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Profile already exists for this user. Use PUT to update.',
      })
    }

    // Create new profile
    const profile = await RoommateProfile.create({
      user_id: parseInt(userId),
      p_gender: gender,
      p_cleanliness_level: cleanlinessLevel,
      p_age: age,
      p_pets: pets,
      p_smoking_habits: smokingHabits,
      bio,
    })

    return res.status(201).json({
      userId: profile.user_id,
      gender: profile.p_gender,
      cleanlinessLevel: profile.p_cleanliness_level,
      age: profile.p_age,
      pets: profile.p_pets,
      smokingHabits: profile.p_smoking_habits,
      bio: profile.bio,
    })
  } catch (error) {
    console.error('Error creating preferences:', error)
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create preferences',
    })
  }
})

// Get user preferences
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const profile = await RoommateProfile.findOne({
      where: { user_id: parseInt(userId) },
    })

    if (!profile) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Roommate profile not found',
      })
    }

    return res.json({
      userId: profile.user_id,
      gender: profile.p_gender,
      cleanlinessLevel: profile.p_cleanliness_level,
      age: profile.p_age,
      pets: profile.p_pets,
      smokingHabits: profile.p_smoking_habits,
      bio: profile.bio,
    })
  } catch (error) {
    console.error('Error fetching preferences:', error)
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch preferences',
    })
  }
})

// Update user preferences
router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const { gender, cleanlinessLevel, age, pets, smokingHabits, bio } = req.body

    let profile = await RoommateProfile.findOne({
      where: { user_id: parseInt(userId) },
    })

    if (!profile) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Profile not found. Use POST to create a new profile.',
      })
    }

    // Update existing profile
    await profile.update({
      p_gender: gender,
      p_cleanliness_level: cleanlinessLevel,
      p_age: age,
      p_pets: pets,
      p_smoking_habits: smokingHabits,
      bio,
    })

    return res.json({
      userId: profile.user_id,
      gender: profile.p_gender,
      cleanlinessLevel: profile.p_cleanliness_level,
      age: profile.p_age,
      pets: profile.p_pets,
      smokingHabits: profile.p_smoking_habits,
      bio: profile.bio,
    })
  } catch (error) {
    console.error('Error updating preferences:', error)
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update preferences',
    })
  }
})

// Get all profiles with user data
router.get('/', async (req, res) => {
  try {
    const profiles = await RoommateProfile.findAll({
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
      ],
    })

    return res.json(
      profiles.map((profile) => {
        const plainProfile = profile.get({ plain: true })
        return {
          userId: plainProfile.user_id,
          gender: plainProfile.p_gender,
          cleanlinessLevel: plainProfile.p_cleanliness_level,
          age: plainProfile.p_age,
          pets: plainProfile.p_pets,
          smokingHabits: plainProfile.p_smoking_habits,
          bio: plainProfile.bio,
          user: plainProfile.User
            ? {
                userId: plainProfile.User.user_id,
                username: plainProfile.User.username,
                email: plainProfile.User.email,
                phoneNumber: plainProfile.User.phone_number,
                profilePicture: plainProfile.User.profile_picture,
              }
            : null,
        }
      })
    )
  } catch (error) {
    console.error('Error fetching all profiles:', error)
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch profiles',
    })
  }
})

export default router
