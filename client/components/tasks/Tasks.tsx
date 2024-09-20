"use client"
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Task, TTasks } from '@/lib/types/tasks';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskTable from './TaskTable';
import CreateTask from '@/components/tasks/CreateTask';
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@/components/ui/dialog"
import { Button } from "react-day-picker";
import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";

interface TasksProps {
    sortBy: string;
    filterPriority: string;
    filterStatus: string;
    filterDueDate: string;
}

const Tasks: React.FC<TasksProps> = ({ sortBy, filterPriority, filterStatus, filterDueDate }) => {
    const [tasks, setTasks] = useState<TTasks>([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useSelector((state: any) => state.user);
    const { toast } = useToast();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks/getAll`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch tasks');
                }

                const data = await response.json();
                if (data.success) {
                    let filteredTasks: Task[] = data.tasks;

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
                    
                    setTasks(filteredTasks);
                } else {
                    throw new Error(data.message || 'Failed to fetch tasks');
                }
            } catch (error) {
                console.error('Error fetching tasks:', error);
                toast({
                    title: "Error",
                    description: "Failed to fetch tasks. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchTasks();
        }
    }, [currentUser, toast, sortBy, filterPriority, filterStatus, filterDueDate]);

    return (
        <div className="flex-grow overflow-y-auto pt-8 no-scrollbar">
            <Dialog>
                <DialogTrigger asChild>
                    <button className="flex items-center  justify-center py-2 px-4 md:py-4 md:px-6 mt-4  rounded-full bg-primary text-primary-foreground absolute  right-0 top-[14vh]  m-2 sm:m-3 sm:right-[9vh] md:m-4 ">
                        <PlusCircle className="w-5 h-5" />
                        <span className="ml-2 text-sm font-medium">Add Task</span>
                    </button>
                </DialogTrigger>
                <DialogContent className="rounded-lg border-input max-w-4xl w-full">
                    <CreateTask tasks={tasks} setTasks={setTasks} />
                </DialogContent>
            </Dialog>
            <div className="container mx-auto p-4">
                <Card className="backdrop-blur-lg bg-background/40 shadow-lg shadow-neutral-600/5 border border-primary/10">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Your Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        ) : tasks.length === 0 ? (
                            <p className="text-center text-muted-foreground">No tasks found. Start by creating a new task!</p>
                        ) : (
                            <TaskTable tasks={tasks} setTasks={setTasks} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Tasks;