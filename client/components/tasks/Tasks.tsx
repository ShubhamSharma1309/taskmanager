"use client"
import CreateTask from '@/components/tasks/CreateTask';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/lib/types/tasks';
import { filterTasks } from '@/lib/utils';
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TaskTable from './TaskTable';
import { RootState } from '@/lib/redux/store';

interface TasksProps {
    sortBy: string;
    filterPriority: string;
    filterStatus: string;
    filterDueDate: string;
}


const Tasks = ({ sortBy, filterPriority, filterStatus, filterDueDate }: TasksProps) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useSelector((state: RootState) => state.user);
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
                    const filteredTasks = filterTasks(data.tasks, filterPriority, filterStatus, filterDueDate, sortBy);
                    setTasks(filteredTasks);
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
                <Card className="backdrop-blur-lg bg-background/80 shadow-lg shadow-neutral-600/5 border border-primary/10">
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