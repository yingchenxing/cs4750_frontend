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

export interface Listing {
  listing_id: number
  user: {
    userId: number
    username: string
    email: string
    phoneNumber: string
    profilePicture: string
  }
  title: string
  description: string
  propertyType: string
  location: string
  rentPrice: number
  leaseDuration: number
  availTimeStart: string
  availTimeEnd: string
  image: string
}

export const getListings = async (): Promise<Listing[]> => {
  try {
    const response = await api.get<Listing[]>('/api/listings')
    return response.data
  } catch (error) {
    console.error('Error fetching listings:', error)
    throw error
  }
}
