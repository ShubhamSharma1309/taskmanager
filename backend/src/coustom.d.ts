import { IUser } from './utils/types/user.types';

declare module 'express-serve-static-core' {
    export interface Request {
        user: IUser;
    }
}