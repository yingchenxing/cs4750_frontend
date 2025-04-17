import axios from 'axios'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://cs4750.onrender.com'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
})

export interface ReviewUser {
  userId: number
  username: string
  profilePicture: string
}

export interface Review {
  reviewId: number
  listingId: number
  rating: number
  comment: string
  createdAt: string
  user: ReviewUser
}

export interface CreateReviewRequest {
  userId: number
  rating: number
  comment: string
}

export interface UpdateReviewRequest {
  rating: number
  comment: string
}

export const getListingReviews = async (
  listingId: string | number
): Promise<Review[]> => {
  try {
    const response = await api.get<Review[]>(
      `/api/reviews/listing/${listingId}`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching reviews:', error)
    throw error
  }
}

export const createReview = async (
  listingId: string | number,
  data: CreateReviewRequest
): Promise<Review> => {
  try {
    const response = await api.post<Review>(
      `/api/reviews/listing/${listingId}`,
      data
    )
    return response.data
  } catch (error) {
    console.error('Error creating review:', error)
    throw error
  }
}

export const updateReview = async (
  reviewId: string | number,
  data: UpdateReviewRequest
): Promise<Review> => {
  try {
    const response = await api.put<Review>(`/api/reviews/${reviewId}`, data)
    return response.data
  } catch (error) {
    console.error('Error updating review:', error)
    throw error
  }
}

export const deleteReview = async (
  reviewId: string | number
): Promise<void> => {
  try {
    await api.delete(`/api/reviews/${reviewId}`)
  } catch (error) {
    console.error('Error deleting review:', error)
    throw error
  }
}

export const handleReviewError = (
  error: any
): { error: string; message: string } => {
  if (error.response) {
    const { status, data } = error.response
    switch (status) {
      case 400:
        return {
          error: 'Bad Request',
          message: data.message || 'You have already reviewed this listing',
        }
      case 401:
        return { error: 'Unauthorized', message: 'Please log in to continue' }
      case 403:
        return {
          error: 'Forbidden',
          message: 'You do not have permission to perform this action',
        }
      case 404:
        return { error: 'Not Found', message: 'Review not found' }
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
