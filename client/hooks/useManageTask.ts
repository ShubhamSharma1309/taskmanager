"use client"
import { TaskUpdate, TTasks } from "@/lib/types/tasks";
import { useState } from "react";

export default function useManageTask() {

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);

    const deleteTask = async (id: string) => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks/remove/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!res.ok) {
                throw new Error('Failed to delete task');
            }
            const data = await res.json();
            if (data.success) {
                return data;
            } else {
                throw new Error(data.message || 'Failed to delete task');
            }
        } catch (error: any) {
            setError(error.message);
            return error;
        } finally {
            setLoading(false);
        }
    }

    const getTask = async (id: string) => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks/get/${id}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!res.ok) {
                throw new Error('Failed to get task');
            }
            const data = await res.json();
            if (data.success) {
                return data;
            } else {
                throw new Error(data.message || 'Failed to get task');
            }
        } catch (error: any) {
            setError(error.message);
            return null;
        } finally {
            setLoading(false);
        }
    }

    const updateTask = async (id: string, task: TaskUpdate) => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
                credentials: 'include',
            });
            if (!res.ok) {
                throw new Error('Failed to update task');
            }
            const data = await res.json();
            if (data.success) {
                return data.task;
            } else {
                throw new Error(data.message || 'Failed to update task');
            }
        } catch (error: any) {
            setError(error.message);
            return null;
        } finally {
            setLoading(false);
        }
    };


    return {
        loading,
        error,
        updateTask,
        getTask,
        deleteTask
    }

};
