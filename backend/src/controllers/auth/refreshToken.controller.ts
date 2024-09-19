import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import configs from '../../configs';
import User from '../../models/user';
import generateTokens from '../../utils/generateTokens';
import { NotFoundError, UnauthorizedError } from '../../utils/Error';


export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw new UnauthorizedError('Refresh token is required');
        }

        const decoded = jwt.verify(refreshToken, configs.REFRESH_TOKEN_SECRET) as { id: string };
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        const tokens = generateTokens(user);

        res.status(200).json({
            success: true,
            ...tokens,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(new UnauthorizedError('Invalid refresh token'));
        } else {
            next(error);
        }
    }
};
