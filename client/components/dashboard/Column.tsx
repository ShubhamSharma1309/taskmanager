import { Task } from '@/lib/types/tasks'
import { formatTaskAttribute } from '@/lib/utils'
import React from 'react'
import { TaskItem } from './TaskItem'

interface ColumnProps {
    status: string;
    tasks: Task[];
    moveTask: (id: string, newStatus: string) => void;
}

export const Column = ({ status, tasks, moveTask }: ColumnProps) => {
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('text/plain');
        moveTask(taskId, status);
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`w-full md:w-1/3 p-4 rounded-lg bg-background/40 backdrop-blur-md border border-primary/10`}
        >
            <h2 className="text-lg font-semibold mb-4">{formatTaskAttribute(status)}</h2>
            {tasks
                .filter((task) => task.status === status)
                .map((task) => (
                    <TaskItem key={task._id} {...task} moveTask={moveTask} />
                ))}
        </div>
    )
}