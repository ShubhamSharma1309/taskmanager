import { NextFunction, Request, Response } from "express";
import Task from "../../models/tasks";
import { NotFoundError, UnauthorizedError } from "../../utils/Error";


export const removeTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.id;
        const userId = req.user?.id;

        if (!userId) {
            return next(new UnauthorizedError("Unauthorized"));
        }

        const task = await Task.findOneAndDelete({ _id: taskId, userId });

        if (!task) {
            throw new NotFoundError('Task not found');

        }

        res.status(200).json({
            success: true,
            message: "Task removed successfully"
        });
    } catch (error) {
        next(error);
    }
};