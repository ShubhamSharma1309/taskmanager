"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"
import { Task, TTasks } from '@/lib/types/tasks';
import { useToast } from "@/hooks/use-toast";
import { DialogClose } from "@/components/ui/dialog";

const EditTask = ({ task, setTasks }: { task: Task, setTasks: React.Dispatch<React.SetStateAction<TTasks>> }) => {
    const [formData, setFormData] = useState<Partial<Task>>({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const { toast } = useToast();

    useEffect(() => {
        setFormData({
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        });
    }, [task]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value ? new Date(value) : null }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks/update/${task._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                toast({
                    title: "Error",
                    description: data.message || "An error occurred while updating the task",
                    variant: "destructive",
                });
                return;
            }

            setTasks(prevTasks =>
                prevTasks.map(t => t._id === data.task._id ? data.task : t)
            );

            toast({
                title: "Success",
                description: "Task updated successfully",
            });
        } catch (error) {
            console.error("An error occurred while updating the task", error);
            toast({
                title: "Error",
                description: "An unexpected error occurred",
                variant: "destructive",
            });
        }
    }

    return (
        <div className="w-full flex flex-col items-center justify-center">
            <Card className="w-full max-w-6xl backdrop-blur-md bg-background/40 shadow-lg shadow-neutral-600/5 border-0 border-primary/10">
                <CardHeader>
                    <CardTitle>Edit Task</CardTitle>
                    <CardDescription>Edit details for your task</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={formData.title || ''}
                                        onChange={handleChange}
                                        placeholder="Enter task title"
                                    />
                                    {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={formData.description || ''}
                                        onChange={handleChange}
                                        placeholder="Enter task description"
                                        className="min-h-[120px]"
                                    />
                                    {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="priority">Priority</Label>
                                    <Select name="priority" value={formData.priority} onValueChange={(value) => handleSelectChange('priority', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="LOW">Low</SelectItem>
                                            <SelectItem value="MEDIUM">Medium</SelectItem>
                                            <SelectItem value="HIGH">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="status">Status</Label>
                                    <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="TODO">To Do</SelectItem>
                                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                            <SelectItem value="COMPLETED">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="dueDate">Due Date (optional)</Label>
                                    <Input
                                        type="date"
                                        id="dueDate"
                                        name="dueDate"
                                        value={formData.dueDate instanceof Date ? formData.dueDate.toISOString().split('T')[0] : ''}
                                        onChange={handleDateChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4 mt-4">
                        <DialogClose asChild>
                            <Button type="submit">Edit Task</Button>
                        </DialogClose>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default EditTask;
