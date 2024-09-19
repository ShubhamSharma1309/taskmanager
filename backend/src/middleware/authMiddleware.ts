import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import configs from '../configs';
import { IUser } from '../utils/types/user.types';
import { UnauthorizedError } from '../utils/Error';

export const authJWT = (req: Request, res: Response, next: NextFunction) => {
   
    const token = req.cookies?.accessToken;

    if (!token) {
        return next(new UnauthorizedError('No token provided'));
    }

    jwt.verify(token, configs.JWT_SECRET, (err: any, user: IUser) => {
        if (err) {
            return next(new UnauthorizedError('Invalid token'));
        }
        req.user = user;
        next();
    });
};