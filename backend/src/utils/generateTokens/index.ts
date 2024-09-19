import jwt from 'jsonwebtoken';
import configs from '../../configs';
import { IUser } from '../types/user.types';

const generateTokens = (user: IUser) => {
    const accessToken = jwt.sign({ id: user._id, username: user.email }, configs.JWT_SECRET, {
        expiresIn: configs.JWT_EXPIRE,
    });
    const refreshToken = jwt.sign({ id: user._id }, configs.REFRESH_TOKEN_SECRET, {
        expiresIn: configs.REFRESH_TOKEN_EXPIRE,
    });
    return { accessToken, refreshToken };
};

export default generateTokens;