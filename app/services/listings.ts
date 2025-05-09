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
  listingId: number
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
  isSublease: boolean
  subleaseReason?: string
}

export interface CreateListingRequest {
  userId: number
  title: string
  description: string
  location: string
  propertyType: string
  rentPrice: number
  leaseDuration: number
  availTimeStart: string
  availTimeEnd: string
  image: string
  isSublease: boolean
  subleaseReason?: string
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

export const getListingById = async (id: string | number): Promise<Listing> => {
  try {
    const response = await api.get<Listing>(`/api/listings/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching listing with id ${id}:`, error)
    throw error
  }
}

export const createListing = async (
  data: CreateListingRequest
): Promise<Listing> => {
  try {
    const response = await api.post<Listing>('/api/listings/create', data)
    return response.data
  } catch (error) {
    console.error('Error creating listing:', error)
    throw error
  }
}

export const getUserListings = async (userId: number): Promise<Listing[]> => {
  try {
    const response = await api.get<Listing[]>(
      `/api/listings/publisher/${userId}`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching user listings:', error)
    throw error
  }
}

export const deleteListing = async (listingId: number): Promise<void> => {
  try {
    await api.delete(`/api/listings/${listingId}`)
  } catch (error) {
    console.error('Error deleting listing:', error)
    throw error
  }
}
