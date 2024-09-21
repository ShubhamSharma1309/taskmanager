import { NextFunction, Request, Response } from 'express';
import User from '../../models/user';
import { UnauthorizedError } from '../../utils/Error';
import generateTokens from '../../utils/generateTokens';

import { LoginSchema } from '../../utils/types/auth.types';


export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = LoginSchema.parse(req.body);

        const user = await User.findOne({ email: userData.email });
        if (!user || !(await user.comparePassword(userData.password))) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const tokens = generateTokens(user);

        res.cookie('accessToken', tokens.accessToken, { httpOnly: true, secure: true, sameSite: 'none' , path: '/', });
        res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true, sameSite: 'none' , path: '/', });

        // Verify cookies are being set
        const cookies = res.getHeader('Set-Cookie');
        if (!cookies || (Array.isArray(cookies) && cookies.length < 2)) {
            throw new Error('Failed to set cookies');
        }

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
        next(error);
    }
};