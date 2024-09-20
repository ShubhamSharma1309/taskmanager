"use client";
import useCreateTask from '@/hooks/useCreateTask';
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"

interface CreateTaskProps {
    setCreatingTask: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const CreateTask: React.FC<CreateTaskProps> = ({ setCreatingTask }) => {
    const {
        handleSubmit,
        handleChange,
        handleSelectChange,
        errors,
        formData
    } = useCreateTask();
    const { theme } = useTheme();

    return (
        <AlertDialog open={true}>
            <AlertDialogContent className="sm:max-w-[425px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Create New Task</AlertDialogTitle>
                    <AlertDialogDescription>Fill in the details for your new task</AlertDialogDescription>
                </AlertDialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
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
                                className="min-h-[80px]"
                            />
                            {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
                        </div>
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
                    <AlertDialogFooter>
                        <Button variant="outline" onClick={() => setCreatingTask(false)} type="button">Cancel</Button>
                        <Button type="submit">Create Task</Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CreateTask;
