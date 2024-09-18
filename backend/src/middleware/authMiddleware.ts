import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import configs from '../configs';
import { IUser } from '../utils/types/user.types';
import ErrorHandler from '../utils/Error/error';

export const authJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (token) {
        jwt.verify(token, configs.JWT_SECRET, (err: any, user: IUser) => {
            if (err) {
                return res.status(403).send({ message: 'Invalid token' });
            }
            req.user = user;
            next();
        });
    } else {
        return new ErrorHandler(401, 'Unauthorized');
    }
};