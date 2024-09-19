import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/user';
import configs from '../../configs';
import { IUser, UserSchema } from '../../utils/types/user.types';
import { LoginSchema } from '../../utils/types/auth.types'
import { UnauthorizedError, NotFoundError } from '../../utils/Error';

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

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = LoginSchema.parse(req.body);

        const user = await User.findOne({ email: userData.email });
        if (!user || !(await user.comparePassword(userData.password))) {
            throw new UnauthorizedError('Invalid credentials');
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
        next(error);
    }
};

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

const generateTokens = (user: IUser) => {
    const accessToken = jwt.sign({ id: user._id, username: user.email }, configs.JWT_SECRET, {
        expiresIn: configs.JWT_EXPIRE,
    });
    const refreshToken = jwt.sign({ id: user._id }, configs.REFRESH_TOKEN_SECRET, {
        expiresIn: configs.REFRESH_TOKEN_EXPIRE,
    });
    return { accessToken, refreshToken };
};