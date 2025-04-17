import pool from '../config/database'

export interface Listing {
  listing_id: number
  user_id: number
  title: string
  description: string
  property_type: string
  location: string
  rent_price: number
  lease_duration: number
  avail_time_start: Date
  avail_time_end: Date
  image: string
}

export interface HouseListing {
  house_listing_id: number
  listing_id: number
}

export interface SubleaseListing {
  sublease_listing_id: number
  listing_id: number
  sublease_reason: string
}

export const createListing = async (
  listing: Omit<Listing, 'listing_id'>
): Promise<Listing> => {
  const {
    user_id,
    title,
    description,
    property_type,
    location,
    rent_price,
    lease_duration,
    avail_time_start,
    avail_time_end,
    image,
  } = listing

  const result = await pool.query(
    `INSERT INTO listings (
      user_id, title, description, property_type, location,
      rent_price, lease_duration, avail_time_start, avail_time_end, image
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    [
      user_id,
      title,
      description,
      property_type,
      location,
      rent_price,
      lease_duration,
      avail_time_start,
      avail_time_end,
      image,
    ]
  )

  return result.rows[0]
}

export const createHouseListing = async (
  listingId: number
): Promise<HouseListing> => {
  const result = await pool.query(
    'INSERT INTO house_listings (listing_id) VALUES ($1) RETURNING *',
    [listingId]
  )
  return result.rows[0]
}

export const createSubleaseListing = async (
  listingId: number,
  subleaseReason: string
): Promise<SubleaseListing> => {
  const result = await pool.query(
    'INSERT INTO sublease_listings (listing_id, sublease_reason) VALUES ($1, $2) RETURNING *',
    [listingId, subleaseReason]
  )
  return result.rows[0]
}

export const getListingById = async (
  listingId: number
): Promise<Listing | null> => {
  const result = await pool.query(
    'SELECT * FROM listings WHERE listing_id = $1',
    [listingId]
  )
  return result.rows[0] || null
}

export const getAllListings = async (): Promise<Listing[]> => {
  const result = await pool.query(
    'SELECT * FROM listings ORDER BY listing_id DESC'
  )
  return result.rows
}

export const saveListing = async (
  userId: number,
  listingId: number
): Promise<void> => {
  await pool.query(
    'INSERT INTO saved_listings (user_id, listing_id) VALUES ($1, $2)',
    [userId, listingId]
  )
}
