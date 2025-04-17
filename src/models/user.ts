import pool from '../config/database'
import bcrypt from 'bcrypt'

export interface User {
  user_id: number
  username: string
  email: string
  phone_number: string | null
  password_hash: string
  profile_picture: string | null
}

export const createUser = async (
  user: Omit<User, 'user_id'>
): Promise<User> => {
  const { username, email, phone_number, password_hash, profile_picture } = user
  const hashedPassword = await bcrypt.hash(password_hash, 10)

  const result = await pool.query(
    'INSERT INTO users (username, email, phone_number, password_hash, profile_picture) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [username, email, phone_number, hashedPassword, profile_picture]
  )

  return result.rows[0]
}

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [
    email,
  ])
  return result.rows[0] || null
}

export const getUserById = async (userId: number): Promise<User | null> => {
  const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [
    userId,
  ])
  return result.rows[0] || null
}

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}
