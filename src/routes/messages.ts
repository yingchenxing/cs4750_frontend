import express from 'express'
import { Message, User } from '../models'
import { Op } from 'sequelize'

const router = express.Router()

// Get conversations for a user
router.get('/conversations/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    // Find all messages where the user is either sender or receiver
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: parseInt(userId) },
          { receiver_id: parseInt(userId) },
        ],
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['user_id', 'username', 'profile_picture'],
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['user_id', 'username', 'profile_picture'],
        },
      ],
      order: [['sent_at', 'DESC']],
    })

    // If no messages found, return empty array
    if (!messages || messages.length === 0) {
      return res.json([])
    }

    // Group messages by conversation partner
    const conversations = messages.reduce((acc: any, message: any) => {
      const plainMessage = message.get({ plain: true })
      const partnerId =
        plainMessage.sender_id === parseInt(userId)
          ? plainMessage.receiver_id
          : plainMessage.sender_id
      const partner =
        plainMessage.sender_id === parseInt(userId)
          ? plainMessage.receiver
          : plainMessage.sender

      if (!acc[partnerId]) {
        acc[partnerId] = {
          partnerId: partnerId,
          partnerName: partner.username,
          partnerProfilePicture: partner.profile_picture,
          lastMessage: {
            content: plainMessage.content,
            sentAt: plainMessage.sent_at,
            isFromUser: plainMessage.sender_id === parseInt(userId),
          },
        }
      }
      return acc
    }, {})

    return res.json(Object.values(conversations))
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch conversations',
    })
  }
})

// Get messages between two users
router.get('/conversation/:userId/:partnerId', async (req, res) => {
  try {
    const { userId, partnerId } = req.params

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          {
            sender_id: parseInt(userId),
            receiver_id: parseInt(partnerId),
          },
          {
            sender_id: parseInt(partnerId),
            receiver_id: parseInt(userId),
          },
        ],
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['user_id', 'username', 'profile_picture'],
        },
      ],
      order: [['sent_at', 'ASC']],
    })

    // If no messages found, return empty array
    if (!messages || messages.length === 0) {
      return res.json([])
    }

    return res.json(
      messages.map((message) => {
        const plainMessage = message.get({ plain: true })
        return {
          messageId: plainMessage.message_id,
          content: plainMessage.content,
          sentAt: plainMessage.sent_at,
          sender: {
            userId: plainMessage.sender.user_id,
            username: plainMessage.sender.username,
            profilePicture: plainMessage.sender.profile_picture,
          },
        }
      })
    )
  } catch (error) {
    console.error('Error fetching messages:', error)
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch messages',
    })
  }
})

// Send a message
router.post('/send', async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body

    // Create the message
    const message = await Message.create({
      sender_id: senderId,
      receiver_id: receiverId,
      content,
      sent_at: new Date(),
    })

    // Fetch the created message with sender info
    const messageWithSender = await Message.findOne({
      where: { message_id: message.message_id },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['user_id', 'username', 'profile_picture'],
        },
      ],
    })

    const plainMessage = messageWithSender!.get({ plain: true })
    return res.status(201).json({
      messageId: plainMessage.message_id,
      content: plainMessage.content,
      sentAt: plainMessage.sent_at,
      sender: {
        userId: plainMessage.sender.user_id,
        username: plainMessage.sender.username,
        profilePicture: plainMessage.sender.profile_picture,
      },
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to send message',
    })
  }
})

export default router
