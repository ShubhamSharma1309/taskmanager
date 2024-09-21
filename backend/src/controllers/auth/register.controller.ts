import { NextFunction, Request, Response } from 'express';
import User from '../../models/user';
import generateTokens from '../../utils/generateTokens';
import { UserSchema } from '../../utils/types/user.types';
import { UnauthorizedError } from '../../utils/Error';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = UserSchema.parse(req.body);

        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new UnauthorizedError('User already exists');
        }

        const user = await User.create(userData);
        const tokens = generateTokens(user);
        res.status(201).json({
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