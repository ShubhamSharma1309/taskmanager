import { NextFunction, Request, Response } from "express";
import Task from "../../models/tasks";
import { UnauthorizedError } from "../../utils/Error";

export const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const userId = req.user?.id;

        if (!userId) {
            return next(new UnauthorizedError('No token provided'));
        }

        const tasks = await Task.find({ userId });

        res.status(200).json({
            success: true,
            tasks
        });
    } catch (error) {
        next(error);
    }
};