import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
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
  windowMs: 10 * 60 * 1000, 
  max: 20, 
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