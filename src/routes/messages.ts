import express from 'express'
import {
  createMessage,
  getMessagesBetweenUsers,
  getConversations,
} from '../models/message'
import { getUserById } from '../models/user'

const router = express.Router()

// Get all conversations
router.get(
  '/conversations',
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const { userId } = req.query
      if (!userId) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'userId is required',
        })
        return
      }

      const conversations = await getConversations(Number(userId))
      const conversationsWithUsers = await Promise.all(
        conversations.map(async (conversation) => {
          const user = await getUserById(conversation.userId)
          return {
            id: conversation.userId,
            participants: user
              ? [
                  {
                    id: user.userId,
                    username: user.username,
                    profileImage: user.profilePicture,
                  },
                ]
              : [],
            lastMessage: conversation.lastMessage,
          }
        })
      )

      res.json({ conversations: conversationsWithUsers })
    } catch (error) {
      console.error('Error fetching conversations:', error)
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch conversations',
      })
    }
  }
)

// Get messages in a conversation
router.get(
  '/conversations/:conversationId',
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const { conversationId } = req.params
      const { userId, page = 1, limit = 50 } = req.query

      if (!userId) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'userId is required',
        })
        return
      }

      const offset = (Number(page) - 1) * Number(limit)
      const messages = await getMessagesBetweenUsers(
        Number(userId),
        Number(conversationId),
        Number(limit),
        offset
      )

      res.json({
        messages,
        total: messages.length,
        page: Number(page),
        limit: Number(limit),
      })
    } catch (error) {
      console.error('Error fetching messages:', error)
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch messages',
      })
    }
  }
)

// Send message
router.post(
  '/conversations/:conversationId',
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const { conversationId } = req.params
      const { userId, content } = req.body

      if (!userId || !content) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'userId and content are required',
        })
        return
      }

      const message = await createMessage({
        senderId: Number(userId),
        receiverId: Number(conversationId),
        content,
      })

      res.status(201).json(message)
    } catch (error) {
      console.error('Error sending message:', error)
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to send message',
      })
    }
  }
)

export default router
