import { useToast } from '@/hooks/use-toast'
import { RootState } from '@/lib/redux/store'
import { Task } from '@/lib/types/tasks'
import { useEffect, useState } from 'react'
import { useDrag } from 'react-dnd'
import { useSelector } from 'react-redux'



export default function useDashboard() {
    const [tasks, setTasks] = useState<Task[]>([])
    const { toast } = useToast();
    const { currentUser, accessToken } = useSelector((state: RootState) => state.user);


    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks/getAll`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch tasks');
                }

                const data = await response.json();
                if (data.success) {
                    setTasks(data.tasks);
                } else {
                    throw new Error(data.message || 'Failed to fetch tasks');
                }
            } catch (error) {
                console.error('Error fetching tasks:', error);
                toast({
                    title: "Error",
                    description: "Failed to fetch tasks. Please try again.",
                    className: "backdrop-blur-md bg-background/80 border-2 border-red-800 rounded-md"
                });
            }
        };

        fetchTasks();
    }, [toast]);

    const moveTask = async (id: string, newStatus: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ status: newStatus }),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to update task');
            }

            const data = await response.json();
            if (data.success) {
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task._id === id ? { ...task, status: newStatus as "TODO" | "IN_PROGRESS" | "COMPLETED" } : task
                    )
                );
                toast({
                    title: "Success",
                    description: "Task status updated successfully",
                    className: "backdrop-blur-md bg-background/80 border-2 border-green-800 rounded-md"
                });
            } else {
                throw new Error(data.message || 'Failed to update task');
            }
        } catch (error) {
            console.error('Error updating task:', error);
            toast({
                title: "Error",
                description: "Failed to update task status. Please try again.",
                className: "backdrop-blur-md bg-background/80 border-2 border-red-800 rounded-md"
            });
        }
    }


    return {
        tasks,
        moveTask
    }
}