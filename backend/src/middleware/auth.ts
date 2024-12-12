import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config'; // Make sure you have JWT_SECRET exported from your config.

// Extend the Express Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

export const auth = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const authHeader = req.headers.authorization || req.header('Authorization');
  
    if (!authHeader) {
      res.status(401).json({ error: 'Authorization header is missing' });
      return; // Explicitly return
    }
  
    // Expected format: 'Bearer <token>'
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      res.status(401).json({
        error: 'Invalid Authorization header format. Expected "Bearer <token>"',
      });
      return; // Explicitly return
    }
  
    const token = tokenParts[1];
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
      req.user = decoded; // Attach decoded info to request
      return next(); // Explicitly return
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
      return; // Explicitly return
    }
  };
  
