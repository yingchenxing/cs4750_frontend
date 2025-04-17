import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  userId?: number
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'No token provided',
    })
    return
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as { userId: number }
    req.userId = decoded.userId
    next()
  } catch (error) {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid or expired token',
    })
  }
}

export const rateLimit = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  next()
}
