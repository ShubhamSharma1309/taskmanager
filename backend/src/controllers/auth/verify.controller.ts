
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import configs from '../../configs';
import User from '../../models/user';
import generateTokens from '../../utils/generateTokens';
import { NotFoundError, UnauthorizedError } from '../../utils/Error';


export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        const accessToken = authHeader && authHeader.split(' ')[1];
        if (!accessToken) {
            throw new UnauthorizedError('No token provided');
        }

        const decoded = jwt.verify(accessToken, configs.JWT_SECRET) as { id: string };

        res.status(200).json({
            success: true,
            "id": decoded.id,
            message: "authorised"
        });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(new UnauthorizedError('Token expired'));
        } else {
            next(error);
        }
    }
};
