import axios from 'axios';
import { LoginResponse } from '@/app/services/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://cs4750.onrender.com';
// Define the Message type based on backend Message.java entity
// Using LoginResponse for sender/receiver as it matches the backend entity structure
export interface Message {
  id: number;
  sender: LoginResponse;    // Matches User entity in backend Message.java
  receiver: LoginResponse;  // same
  content: string;
  timestamp: string;
}

// Define request type for sending message
export interface SendMessageData {
  senderId: number;
  receiverId: number;
  content: string;
}

// --- Axios Instance ---
// Make sure axios is used to create the instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});
// --- API Funcs ---
export const messageService = {
  async getConversation(userId1: number, userId2: number): Promise<Message[]> {
    try {
      // Call the backend endpoint to get messages between two users
      const response = await api.get<Message[]>('/api/messages/conversation', {
        params: { user1: userId1, user2: userId2 }, // Matches @RequestParam in Controller
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  },

  async sendMessage(data: SendMessageData): Promise<Message> {
    try {
      // Construct the payload to match backend's SendMessageRequest
      // which currently expects nested User objects containing IDs
      const payload = {
        sender: { userId: data.senderId },
        receiver: { userId: data.receiverId },
        content: data.content,
      };

      const response = await api.post<Message>('/api/messages/send', payload);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // TODO: Implement getChatList function (requires new backend endpoint)
};

// TODO: Define ChatSummary type