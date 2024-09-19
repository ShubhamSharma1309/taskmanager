import { NextFunction, Request, Response } from "express";
import Task from "../../models/tasks";
import { TaskSchema } from "../../utils/types/tasks.types";
import { UnauthorizedError } from "../../utils/Error";

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new UnauthorizedError();
        }

        const taskData = TaskSchema.parse({ ...req.body, userId });

        const task = await Task.create(taskData);

        res.status(201).json({
            success: true,
            task
        });
    } catch (error) {
        next(error);
    }
};