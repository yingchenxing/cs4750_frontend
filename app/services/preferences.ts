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
  withCredentials: true,
})

export interface UserProfile {
  userId: number
  username: string
  email: string
  phoneNumber: string
  profilePicture: string
}

export interface UserPreferences {
  userId: number
  gender: string
  cleanlinessLevel: string
  age: number
  pets: boolean
  smokingHabits: boolean
  bio: string
}

export interface UserPreferencesWithProfile extends UserPreferences {
  user: UserProfile
}

export interface CreatePreferencesRequest {
  userId: number
  gender: string
  cleanlinessLevel: string
  age: number
  pets: boolean
  smokingHabits: boolean
  bio: string
}

export interface UpdatePreferencesRequest {
  gender: string
  cleanlinessLevel: string
  age: number
  pets: boolean
  smokingHabits: boolean
  bio: string
}

export const getAllProfiles = async (): Promise<
  UserPreferencesWithProfile[]
> => {
  try {
    const response = await api.get<UserPreferencesWithProfile[]>(
      '/api/preferences'
    )
    return response.data
  } catch (error) {
    console.error('Error fetching all profiles:', error)
    throw error
  }
}

export const createUserPreferences = async (
  data: CreatePreferencesRequest
): Promise<UserPreferences> => {
  try {
    const response = await api.post<UserPreferences>('/api/preferences', data)
    return response.data
  } catch (error) {
    console.error('Error creating preferences:', error)
    throw error
  }
}

export const getUserPreferences = async (
  userId: number
): Promise<UserPreferences> => {
  try {
    const response = await api.get<UserPreferences>(
      `/api/preferences/${userId}`
    )
    return response.data
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw error // Let the component handle the 404 case
    }
    throw error
  }
}

export const updateUserPreferences = async (
  userId: number,
  data: UpdatePreferencesRequest
): Promise<UserPreferences> => {
  try {
    const response = await api.put<UserPreferences>(
      `/api/preferences/${userId}`,
      data
    )
    return response.data
  } catch (error) {
    console.error('Error updating preferences:', error)
    throw error
  }
}

// Helper function to handle API errors
export const handlePreferencesError = (
  error: any
): { error: string; message: string } => {
  if (error.response) {
    const { status, data } = error.response
    switch (status) {
      case 400:
        return {
          error: 'Bad Request',
          message: data.message || 'Invalid request data',
        }
      case 401:
        return { error: 'Unauthorized', message: 'Please log in to continue' }
      case 403:
        return {
          error: 'Forbidden',
          message: 'You do not have permission to perform this action',
        }
      case 404:
        return { error: 'Not Found', message: 'Please set up your preferences' }
      case 500:
        return {
          error: 'Internal Server Error',
          message: 'An unexpected error occurred',
        }
      default:
        return { error: 'Error', message: 'An unexpected error occurred' }
    }
  }
  return { error: 'Network Error', message: 'Unable to connect to the server' }
}
