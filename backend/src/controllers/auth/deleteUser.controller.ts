import { NextFunction, Request, Response } from 'express';
import User from '../../models/user';
import { NotFoundError, UnauthorizedError } from '../../utils/Error';

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const loggedInUserId = req.user?.id;
        const userIdToDelete = req.params.id;

        if (!loggedInUserId) {
            throw new UnauthorizedError('User not authenticated');
        }

        if (loggedInUserId !== userIdToDelete) {
            throw new UnauthorizedError('Unauthorized to delete this user');
        }

        const deletedUser = await User.findByIdAndDelete(userIdToDelete);

        if (!deletedUser) {
            throw new NotFoundError('User not found');
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};
