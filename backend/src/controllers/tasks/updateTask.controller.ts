import { NextFunction, Request, Response } from "express";
import Task from "../../models/tasks";
import { NotFoundError, UnauthorizedError } from "../../utils/Error";
import { TaskUpdateSchema } from "../../utils/types/tasks.types";


export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.id;
        const userId = req.user?.id;
        const updates = TaskUpdateSchema.parse(req.body);

        if (!userId) {
            return next(new UnauthorizedError( "Unauthorized"));
        }

        const task = await Task.findOne({ _id: taskId, userId });

        if (!task) {
            return next(new NotFoundError("Task not found"));
        }

        Object.assign(task, updates);
        await task.save();

        res.status(200).json({
            success: true,
            task
        });
    } catch (error) {
        next(error);
    }
};