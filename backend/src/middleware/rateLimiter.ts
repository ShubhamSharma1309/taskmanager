import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

export const apiRateLimit = rateLimit({
  windowMs:  60 * 60 * 1000, 
  max: 1200, 
  standardHeaders: true,
  legacyHeaders: false,
  message: 'RateLimit exceeds . please try again after 15 minutes',
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'RateLimit exceeds . please try again after 15 minutes'
    });
  }
});

export const authRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 100, 
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Rate limit exceeded. Please try again after 1 hour.',
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Rate limit exceeded. Please try again after 1 hour.'
    });
  }
});

export const taskRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 1000, 
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Rate limit exceeded. Please try again after 1 hour.',
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Rate limit exceeded. Please try again after 1 hour.'
    });
  }
});