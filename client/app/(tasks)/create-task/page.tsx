"use client";
import useCreateTask from '@/hooks/useCreateTask';
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CreateTask = () => {
  const {
    handleSubmit,
    handleChange,
    handleSelectChange,
    errors,
    formData
  } = useCreateTask();
  const { theme } = useTheme();

  return (
    <div className="w-full flex pt-32 flex-col items-center justify-center min-h-screen bg-white dark:bg-black">
      <Card className="w-[350px] backdrop-blur-md bg-background/40 shadow-lg shadow-neutral-600/5 border border-primary/10">
        <CardHeader>
          <CardTitle>Create New Task</CardTitle>
          <CardDescription>Fill in the details for your new task</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
              />
              {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter task description"
              />
              {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
            </div>
            <div className="space-y-2">
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
            <div className="space-y-2">
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
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
                onChange={handleChange}
              />
            </div>
            <Button className="w-full" type="submit">
              Create Task
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTask;
