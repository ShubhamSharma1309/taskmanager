import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import useTask from "@/hooks/use-task";
import { Task } from "@/lib/types/tasks";
import { formatTaskAttribute } from '@/lib/utils';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { Edit, Trash2, ViewIcon } from "lucide-react";
import React from 'react';
import EditTask from './EditTasks';

interface TaskTableProps {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskTable = ({ tasks, setTasks }: TaskTableProps) => {
    const {
        deletingTaskId,
        handleCancelDelete,
        handleConfirmDelete,
        handleDelete
    } = useTask({ tasks, setTasks });

    return (
        <div className="w-full overflow-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-secondary/50">
                        <TableHead className="font-semibold w-1/6 text-primary">Title</TableHead>
                        <TableHead className="font-semibold w-1/6 text-primary">Description</TableHead>
                        <TableHead className="font-semibold w-1/6 text-center text-primary">Status</TableHead>
                        <TableHead className="font-semibold w-1/6 text-center text-primary">Priority</TableHead>
                        <TableHead className="font-semibold w-1/6 text-center text-primary">Due Date</TableHead>
                        <TableHead className="font-semibold w-1/6 text-center text-primary">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks.map((task) => (
                        <TableRow key={task._id} className="hover:bg-muted/50 transition-colors">
                            <TableCell className="font-medium truncate text-foreground">{task.title}</TableCell>
                            <TableCell className="text-muted-foreground truncate">{task.description.slice(0, 20)}...</TableCell>
                            <TableCell className='text-center'>
                                <Badge variant={task.status === 'COMPLETED' ? 'default' : 'secondary'} className={`
                                    backdrop-blur-sm text-white font-medium
                                    ${task.status === 'COMPLETED' ? 'bg-green-500/70' :
                                        task.status === 'IN_PROGRESS' ? 'bg-yellow-500/70' : 'bg-blue-500/70'}
                                `}>
                                    {formatTaskAttribute(task.status)}
                                </Badge>
                            </TableCell>
                            <TableCell className='text-center'>
                                <Badge variant={task.priority === 'HIGH' ? 'destructive' : 'outline'} className={`
                                    backdrop-blur-sm text-white font-medium
                                    ${task.priority === 'HIGH' ? 'bg-red-500/70' :
                                        task.priority === 'MEDIUM' ? 'bg-yellow-500/70' : 'bg-green-500/70'}
                                `}>
                                    {formatTaskAttribute(task.priority)}
                                </Badge>
                            </TableCell>
                            <TableCell className=" text-center font-medium  text-foreground">
                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-center space-x-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="px-4 py-2">
                                                <ViewIcon className="h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[500px] backdrop-blur-md bg-background/80">
                                            <DialogHeader>
                                                <DialogTitle>{task.title}</DialogTitle>
                                                <DialogDescription>{task.description}</DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className=" items-center gap-4">
                                                    <div>Status</div>
                                                    <Badge variant={task.status === 'COMPLETED' ? 'default' : 'secondary'} className={`
                                    backdrop-blur-sm text-white font-medium
                                    ${task.status === 'COMPLETED' ? 'bg-green-500/70' :
                                                            task.status === 'IN_PROGRESS' ? 'bg-yellow-500/70' : 'bg-blue-500/70'}
                                `}>
                                                        {formatTaskAttribute(task.status)}
                                                    </Badge>
                                                </div>
                                                <div className=" items-center gap-4">
                                                    <div>Priority</div>
                                                    <Badge variant={task.priority === 'HIGH' ? 'destructive' : 'outline'} className={`
                                    backdrop-blur-sm text-white font-medium
                                    ${task.priority === 'HIGH' ? 'bg-red-500/70' :
                                                            task.priority === 'MEDIUM' ? 'bg-yellow-500/70' : 'bg-green-500/70'}
                                `}>
                                                        {formatTaskAttribute(task.priority)}
                                                    </Badge>
                                                </div>
                                                <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                                                    <div>Due Date</div>
                                                    <div>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</div>
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <DialogClose>
                                                    <Button variant="outline">Close</Button>
                                                </DialogClose>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="px-4 py-2">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="rounded-lg border-input max-w-4xl w-full">
                                            <EditTask task={task} setTasks={setTasks} />
                                            {/* <DialogFooter>
                                                <DialogClose>
                                                    <Button variant="outline">Close</Button>
                                                </DialogClose>
                                            </DialogFooter> */}
                                        </DialogContent>
                                    </Dialog>
                                    {deletingTaskId && deletingTaskId === task._id && (
                                        <AlertDialog open={true}>
                                            <AlertDialogContent className="backdrop-blur-md bg-background/80">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Task</AlertDialogTitle>
                                                    <AlertDialogDescription>Are you sure you want to delete this task?</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter className="gap-2">
                                                    <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-500">Delete</AlertDialogAction>
                                                    <AlertDialogCancel onClick={handleCancelDelete} className="bg-secondary">Cancel</AlertDialogCancel>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(task._id)}
                                        className="px-4 py-2"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>

                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default TaskTable;
