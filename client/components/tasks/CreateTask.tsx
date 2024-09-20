"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"
import { TTasks } from '@/lib/types/tasks';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import { TaskSchema, Task } from '@/lib/types/tasks';
import { DialogClose } from '@/components/ui/dialog'

const CreateTask = ({ tasks, setTasks }: { tasks: TTasks, setTasks: React.Dispatch<React.SetStateAction<TTasks>> }) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: undefined,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const { currentUser } = useSelector((state: any) => state.user);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    try {
      const validationResult = TaskSchema.omit({ _id: true, userId: true, createdAt: true, updatedAt: true }).safeParse(formData);

      if (!validationResult.success) {
        const formattedErrors = validationResult.error.format();
        const newErrors: { [key: string]: string } = {};
        Object.entries(formattedErrors).forEach(([key, value]) => {
          if (key !== '_errors' && typeof value === 'object' && '_errors' in value) {
            newErrors[key] = value._errors.join(', ');
          }
        });
        setErrors(newErrors);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        const newTasks: TTasks = [...tasks, data.task];
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
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full flex  flex-col items-center justify-center  ">
      <Card className="w-full max-w-6xl backdrop-blur-md bg-background/40 shadow-lg shadow-neutral-600/5 border-0 border-primary/10">
        <CardHeader>
          <CardTitle>Create New Task</CardTitle>
          <CardDescription>Fill in the details for your new task</CardDescription>
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
                    value={formData.title}
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
                    value={formData.description}
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
                    value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4 mt-4">
            <DialogClose>
              <Button type="submit">Create Task</Button>
            </DialogClose>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateTask;
