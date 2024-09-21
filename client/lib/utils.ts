import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Task } from "./types/tasks";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatTaskAttribute(attribute: string): string {
    switch (attribute) {
        case 'HIGH':
            return 'High';
        case 'TODO':
            return 'Todo';
        case 'MEDIUM':
            return 'Medium';
        case 'LOW':
            return 'Low';
        case 'COMPLETED':
            return 'Completed';
        case 'IN_PROGRESS':
            return 'In Progress';
        case 'NOT_STARTED':
            return 'Not Started';
        default:
            return attribute;
    }
}

export function filterTasks(tasks: Task[], filterPriority: string, filterStatus: string, filterDueDate: string, sortBy: string): Task[] {
    let filteredTasks = tasks;

    if (filterPriority !== "ALL") {
        filteredTasks = filteredTasks.filter((task: Task) => task.priority === filterPriority);
    }
    if (filterStatus !== "ALL") {
        filteredTasks = filteredTasks.filter((task: Task) => task.status === filterStatus);
    }
    if (filterDueDate !== "ALL") {
        const today = new Date();
        const weekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        const monthLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        filteredTasks = filteredTasks.filter((task: Task) => {
            const dueDate = task.dueDate ? new Date(task.dueDate) : null;
            if (!dueDate) return false;
            switch (filterDueDate) {
                case "TODAY":
                    return dueDate.toDateString() === today.toDateString();
                case "THIS_WEEK":
                    return dueDate >= today && dueDate <= weekLater;
                case "THIS_MONTH":
                    return dueDate >= today && dueDate <= monthLater;
                default:
                    return true;
            }
        });
    }

    // Apply sorting
    filteredTasks.sort((a: Task, b: Task) => {
        switch (sortBy) {
            case "dueDate":
                return (a.dueDate ? new Date(a.dueDate).getTime() : 0) - (b.dueDate ? new Date(b.dueDate).getTime() : 0);
            case "priority":
                const priorityOrder: { [key: string]: number } = { LOW: 1, MEDIUM: 2, HIGH: 3 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            case "status":
                const statusOrder: { [key: string]: number } = { TODO: 1, IN_PROGRESS: 2, COMPLETED: 3 };
                return statusOrder[a.status] - statusOrder[b.status];
            default:
                return 0;
        }
    });

    return filteredTasks;
}