import axios from 'axios'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://cs4750.onrender.com'

// API Types
export interface MessageSender {
  userId: number
  username: string
  profilePicture: string
}

export interface Message {
  messageId: number
  content: string
  sentAt: string
  sender: MessageSender
}

export interface LastMessage {
  content: string
  sentAt: string
  isFromUser: boolean
}

export interface Conversation {
  partnerId: number
  partnerName: string
  partnerProfilePicture: string
  lastMessage: LastMessage
}

export interface SendMessageRequest {
  senderId: number
  receiverId: number
  content: string
}

// API instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
})

class MessageService {
  async getConversations(userId: number): Promise<Conversation[]> {
    try {
      const response = await api.get<Conversation[]>(
        `/api/messages/conversations/${userId}`
      )
      return response.data
    } catch (error) {
      console.error('Error fetching conversations:', error)
      throw this.handleError(error)
    }
  }

  async getConversation(userId: number, partnerId: number): Promise<Message[]> {
    try {
      const response = await api.get<Message[]>(
        `/api/messages/conversation/${userId}/${partnerId}`
      )
      return response.data
    } catch (error) {
      console.error('Error fetching messages:', error)
      throw this.handleError(error)
    }
  }

  async sendMessage(data: SendMessageRequest): Promise<Message> {
    try {
      const response = await api.post<Message>('/api/messages/send', data)
      return response.data
    } catch (error) {
      console.error('Error sending message:', error)
      throw this.handleError(error)
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message
      return new Error(message)
    }
    return error instanceof Error
      ? error
      : new Error('An unknown error occurred')
  }
}

export const messageService = new MessageService()
