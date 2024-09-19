import { NextFunction, Request, Response } from "express";
import Task from "../../models/tasks";
import { NotFoundError, UnauthorizedError } from "../../utils/Error";


export const getTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.id;
        const userId = req.user?.id;

        if (!userId) {
            return next(new UnauthorizedError('user not found'));

        }

        const task = await Task.findOne({ _id: taskId, userId });

        if (!task) {
            return next(new NotFoundError("Task not found"));
        }

        res.status(200).json({
            success: true,
            task
        });
    } catch (error) {
        next(error);
    }
};