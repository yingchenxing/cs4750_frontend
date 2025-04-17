/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Import routes
import authRoutes from './routes/auth'
import listingRoutes from './routes/listings'
import messageRoutes from './routes/messages'
import roommateRoutes from './routes/roommates'

// Load environment variables
dotenv.config()

const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://cs4750.netlify.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  })
)
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/listings', listingRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/roommates', roommateRoutes)

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    })
  }
)

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
