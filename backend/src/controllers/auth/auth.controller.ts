import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/user';
import configs from '../../configs';
import ErrorHandler from '../../utils/Error/error';
import { UserSchema } from '../../utils/types/user.types';
import { LoginSchema } from '../../utils/types/auth.types'

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = UserSchema.parse(req.body);

        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new ErrorHandler(400, 'User already exists');
        }

        const user = await User.create(userData);
        const token = jwt.sign({ id: user._id, username: user.email }, configs.JWT_SECRET, {
            expiresIn: configs.JWT_EXPIRE,
        });

        res.status(201).json({
            success: true,
            token,
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
            throw new ErrorHandler(401, 'Invalid credentials');
        }

        const token = jwt.sign({ id: user._id, username: user.email }, configs.JWT_SECRET, {
            expiresIn: configs.JWT_EXPIRE,
        });

        res.status(200).json({
            success: true,
            token,
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

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        next(error);
    }
};