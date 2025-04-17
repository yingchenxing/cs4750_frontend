import pool from '../config/database'

export interface Message {
  message_id: number
  sender_id: number
  receiver_id: number
  content: string
  sent_at: Date
}

export const createMessage = async (
  message: Omit<Message, 'message_id' | 'sent_at'>
): Promise<Message> => {
  const { sender_id, receiver_id, content } = message

  const result = await pool.query(
    'INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *',
    [sender_id, receiver_id, content]
  )

  return result.rows[0]
}

export const getMessagesBetweenUsers = async (
  userId1: number,
  userId2: number,
  limit: number = 50,
  offset: number = 0
): Promise<Message[]> => {
  const result = await pool.query(
    `SELECT * FROM messages 
     WHERE (sender_id = $1 AND receiver_id = $2) 
     OR (sender_id = $2 AND receiver_id = $1)
     ORDER BY sent_at DESC
     LIMIT $3 OFFSET $4`,
    [userId1, userId2, limit, offset]
  )

  return result.rows
}

export const getConversations = async (
  userId: number
): Promise<{ userId: number; lastMessage: Message }[]> => {
  const result = await pool.query(
    `SELECT DISTINCT ON (other_user_id) 
     other_user_id as user_id,
     m.*
     FROM (
       SELECT 
         CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END as other_user_id,
         MAX(message_id) as last_message_id
       FROM messages
       WHERE sender_id = $1 OR receiver_id = $1
       GROUP BY other_user_id
     ) as recent_messages
     JOIN messages m ON m.message_id = recent_messages.last_message_id
     ORDER BY other_user_id, m.sent_at DESC`,
    [userId]
  )

  return result.rows.map((row) => ({
    userId: row.user_id,
    lastMessage: {
      message_id: row.message_id,
      sender_id: row.sender_id,
      receiver_id: row.receiver_id,
      content: row.content,
      sent_at: row.sent_at,
    },
  }))
}
