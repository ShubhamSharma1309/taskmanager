import { useToast } from '@/hooks/use-toast';
import { RootState } from '@/lib/redux/store';
import { Task, TaskSchema, TTasks } from '@/lib/types/tasks';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ZodFormattedError } from "zod";

interface ITask {
    task?: Task;
    tasks?: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}


export default function useTask({ task, tasks, setTasks }: ITask) {

    const [formData, setFormData] = useState<Partial<Task>>({
        title: task ? task.title : '',
        description: task ? task.description : '',
        status: task ? task.status : 'TODO',
        priority: task ? task.priority : 'MEDIUM',
        dueDate: task ? task.dueDate ? new Date(task.dueDate) : undefined : undefined,
    });
    const [errors, setErrors] = useState<ZodFormattedError<Task> | null>(null);
    const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
    const router = useRouter();
    const { toast } = useToast();
    const { accessToken } = useSelector((state: RootState) => state.user);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors(null);

        try {
            const validationResult = TaskSchema.omit({ _id: true, userId: true, createdAt: true, updatedAt: true }).safeParse(formData);

            if (!validationResult.success) {
                const formattedErrors = validationResult.error.format();
                setErrors(formattedErrors);
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                    
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            const data = await response.json();

            if (data.success) {
                const newTasks: TTasks = [...tasks!, data.task];
                setTasks(newTasks);
                toast({
                    title: "Success",
                    description: "Task created successfully",
                    className: "backdrop-blur-md bg-background/80 border-2 border-green-800 rounded-md",
                });
                router.push('/tasks');
            } else {
                throw new Error(data.message || 'Failed to create task');
            }
        } catch (error) {
            console.error('Error creating task:', error);
            toast({
                title: "Error",
                description: "Failed to create task. Please try again.",
                className: "backdrop-blur-md bg-background/80 border-2 border-red-800 rounded-md"
            });
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value ? new Date(value) : null }));
    };

    const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks/update/${task?._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                toast({
                    title: "Error",
                    description: data.message || "An error occurred while updating the task",
                    className: "backdrop-blur-md bg-background/80 border-2 border-red-800 rounded-md"
                });
                return;
            }

            setTasks(prevTasks =>
                prevTasks.map(t => t._id === data.task._id ? data.task : t)
            );

            toast({
                title: "Success",
                description: "Task updated successfully",
                className: "backdrop-blur-md bg-background/80 border-2 border-green-800 rounded-md"
            });
        } catch (error) {
            console.error("An error occurred while updating the task", error);
            toast({
                title: "Error",
                description: "An unexpected error occurred",
                className: "backdrop-blur-md bg-background/80 border-2 border-red-800 rounded-md"
            });
        }
    };

    const handleDelete = (id: string) => {
        setDeletingTaskId(id);
    }

    const handleCancelDelete = () => {
        setDeletingTaskId(null);
    }

    const handleConfirmDelete = async () => {
        if (!deletingTaskId) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks/remove/${deletingTaskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                credentials: 'include',
            });

            const deleteResult = await res.json();

            if (!res.ok) {
                toast({
                    className: "backdrop-blur-md bg-background/80 border-2 border-red-800 rounded-md",
                    title: "Error",
                    description: 'Something went wrong while deleting the task.'
                });
                return;
            }

            setTasks((prevTasks) => prevTasks.filter((task) => task._id !== deletingTaskId));
            toast({
                title: "Success",
                description: deleteResult.message || 'Task deleted successfully.',
                className: "backdrop-blur-md bg-background/80 border-2 border-green-800 rounded-md"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: 'Error deleting task',
                className: "backdrop-blur-md bg-background/80 border-2 border-red-800 rounded-md"
            });
        } finally {
            setDeletingTaskId(null);
        }
    };

    return {
        formData,
        errors,
        deletingTaskId,
        handleChange,
        handleSelectChange,
        handleCreateSubmit,
        handleDateChange,
        handleEditSubmit,
        handleDelete,
        handleCancelDelete,
        handleConfirmDelete,
        setFormData
    }
}