import axios from 'axios'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://cs4750.onrender.com'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // This is important for CORS with credentials
})

export interface LoginResponse {
  userId: number
  username: string
  email: string
  phoneNumber: string
  passwordHash: string
  profilePicture: string
}

export interface SignupRequest {
  username: string
  email: string
  password: string
  phoneNumber?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post('/api/auth/login', data)
    return response.data
  },

  async signup(data: SignupRequest): Promise<{ email: string }> {
    const response = await api.post('/api/auth/signup', data)
    return response.data
  },
}
