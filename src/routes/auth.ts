import express from 'express'
import { createUser, getUserByEmail, verifyPassword } from '../models/user'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const router = express.Router()

// Register new user
router.post(
  '/signup',
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const { username, email, password, phoneNumber } = req.body

      // Check if email already exists
      const existingUser = await getUserByEmail(email)
      if (existingUser) {
        res.status(400).json({ error: 'Email already exists' })
        return
      }

      // Create new user
      const newUser = await createUser({
        username,
        email,
        phone_number: phoneNumber,
        password_hash: password,
        profile_picture: null,
      })

      // Return success response
      res.status(200).json({
        email: newUser.email,
      })
    } catch (error) {
      console.error('Signup error:', error)
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to create user',
      })
    }
  }
)

// Login user
router.post(
  '/login',
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const { email, password } = req.body

      // Find user by email
      const user = await getUserByEmail(email)
      if (!user) {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid email or password',
        })
        return
      }

      // Verify password
      const isValidPassword = await verifyPassword(password, user.password_hash)
      if (!isValidPassword) {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid email or password',
        })
        return
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.user_id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      )

      // Return user data and token
      res.status(200).json({
        userId: user.user_id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phone_number,
        profilePicture: user.profile_picture,
        token,
      })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to login',
      })
    }
  }
)

export default router
