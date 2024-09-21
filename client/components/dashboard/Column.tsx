import { Task } from '@/lib/types/tasks'
import { formatTaskAttribute } from '@/lib/utils'
import React from 'react'
import { useDrop } from 'react-dnd'
import { TaskItem } from './TaskItem'

interface ColumnProps {
    status: string;
    tasks: Task[];
    moveTask: (id: string, newStatus: string) => void;
}

export const Column = ({ status, tasks, moveTask }: ColumnProps) => {
    
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'Task',
        drop: (item: Task) => moveTask(item._id, status),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    return (
        <div
            ref={drop as unknown as React.RefObject<HTMLDivElement>}
            className={`w-full md:w-1/3 p-4 rounded-lg ${isOver ? 'bg-muted/50' : 'bg-background/40'} backdrop-blur-md border border-primary/10`}
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
