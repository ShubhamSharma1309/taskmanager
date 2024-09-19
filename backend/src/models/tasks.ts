import mongoose, { Schema } from "mongoose";
import { ITask } from "../utils/types/tasks.types";

const taskSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["TODO", "IN_PROGRESS", "COMPLETED"],
        default: "TODO",
    },
    priority: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH"],
        default: "MEDIUM",
    },
    dueDate: {
        type: Date,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});


export default mongoose.model<ITask>('Task', taskSchema);
