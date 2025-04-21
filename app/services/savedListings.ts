import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
})

export interface SavedListing {
  savedId: number
  userId: number
  listingId: number
  savedAt: string
}

export const checkIfListingSaved = async (
  listingId: number,
  userId: number
): Promise<SavedListing | null> => {
  try {
    const response = await api.get<SavedListing>(
      `/api/saved-listings/listing/${listingId}/user/${userId}`
    )
    return response.data
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null
    }
    console.error('Error checking saved listing:', error)
    throw handleSavedListingError(error)
  }
}

export const saveListing = async (
  userId: number,
  listingId: number
): Promise<SavedListing> => {
  try {
    const response = await api.post<SavedListing>('/api/saved-listings', {
      userId,
      listingId,
    })
    return response.data
  } catch (error) {
    console.error('Error saving listing:', error)
    throw handleSavedListingError(error)
  }
}

export const deleteSavedListing = async (savedId: number): Promise<void> => {
  try {
    await api.delete(`/api/saved-listings/${savedId}`)
  } catch (error) {
    console.error('Error deleting saved listing:', error)
    throw handleSavedListingError(error)
  }
}

export const handleSavedListingError = (
  error: any
): { error: string; message: string } => {
  if (error.response) {
    const { status, data } = error.response
    switch (status) {
      case 400:
        return {
          error: 'Bad Request',
          message: data.message || 'Listing is already saved',
        }
      case 401:
        return { error: 'Unauthorized', message: 'Please log in to continue' }
      case 403:
        return {
          error: 'Forbidden',
          message: 'You do not have permission to perform this action',
        }
      case 404:
        return { error: 'Not Found', message: 'Saved listing not found' }
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
