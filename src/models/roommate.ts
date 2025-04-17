import pool from '../config/database'

export interface RoommateProfile {
  profile_id: number
  user_id: number
  p_gender: string | null
  p_cleanliness_level: string | null
  p_age: number | null
  p_pets: boolean | null
  p_smoking_habits: boolean | null
  bio: string | null
}

export const createRoommateProfile = async (
  profile: Omit<RoommateProfile, 'profile_id'>
): Promise<RoommateProfile> => {
  const {
    user_id,
    p_gender,
    p_cleanliness_level,
    p_age,
    p_pets,
    p_smoking_habits,
    bio,
  } = profile

  const result = await pool.query(
    `INSERT INTO roommate_profiles (
      user_id, p_gender, p_cleanliness_level, p_age,
      p_pets, p_smoking_habits, bio
    ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [
      user_id,
      p_gender,
      p_cleanliness_level,
      p_age,
      p_pets,
      p_smoking_habits,
      bio,
    ]
  )

  return result.rows[0]
}

export const updateRoommateProfile = async (
  userId: number,
  profile: Partial<Omit<RoommateProfile, 'profile_id' | 'user_id'>>
): Promise<RoommateProfile> => {
  const {
    p_gender,
    p_cleanliness_level,
    p_age,
    p_pets,
    p_smoking_habits,
    bio,
  } = profile

  const result = await pool.query(
    `UPDATE roommate_profiles 
     SET p_gender = COALESCE($1, p_gender),
         p_cleanliness_level = COALESCE($2, p_cleanliness_level),
         p_age = COALESCE($3, p_age),
         p_pets = COALESCE($4, p_pets),
         p_smoking_habits = COALESCE($5, p_smoking_habits),
         bio = COALESCE($6, bio)
     WHERE user_id = $7
     RETURNING *`,
    [
      p_gender,
      p_cleanliness_level,
      p_age,
      p_pets,
      p_smoking_habits,
      bio,
      userId,
    ]
  )

  return result.rows[0]
}

export const getRoommateProfile = async (
  userId: number
): Promise<RoommateProfile | null> => {
  const result = await pool.query(
    'SELECT * FROM roommate_profiles WHERE user_id = $1',
    [userId]
  )
  return result.rows[0] || null
}

export const getRoommateMatches = async (
  userId: number,
  limit: number = 10,
  offset: number = 0
): Promise<RoommateProfile[]> => {
  const result = await pool.query(
    `SELECT rp.* 
     FROM roommate_profiles rp
     WHERE rp.user_id != $1
     ORDER BY rp.profile_id DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  )
  return result.rows
}
