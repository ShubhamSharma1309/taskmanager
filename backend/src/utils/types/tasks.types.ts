import { z } from 'zod';
import { Document } from 'mongoose';

export const TaskSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).default("TODO"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
    dueDate: z.coerce.date().optional(),
    userId: z.string().min(1, { message: "User ID is required" }),
});

export type Task = z.infer<typeof TaskSchema>;

export interface ITask extends Task, Document {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}

export const TaskUpdateSchema = TaskSchema.partial().omit({ userId: true });

export type TaskUpdate = z.infer<typeof TaskUpdateSchema>;
