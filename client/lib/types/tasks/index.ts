import { z } from 'zod';

export const TaskSchema = z.object({
    _id: z.string(),
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).default("TODO"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
    dueDate: z.coerce.date().optional(),
    userId: z.string().min(1, { message: "User ID is required" }),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type Task = z.infer<typeof TaskSchema>;

export const TasksSchema = z.array(TaskSchema);

export type TTasks = z.infer<typeof TasksSchema>;

export const TaskUpdateSchema = TaskSchema.partial().omit({ userId: true, _id: true, createdAt: true, updatedAt: true });

export type TaskUpdate = z.infer<typeof TaskUpdateSchema>;
