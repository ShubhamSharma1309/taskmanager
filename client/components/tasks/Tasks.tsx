"use client"
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Task, TTasks } from '@/lib/types/tasks';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Tasks = () => {
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
          setTasks(data.tasks);
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
  }, [currentUser, toast]);

  return (
    <div className="flex-grow overflow-y-auto pt-14">
      <div className="container mx-auto p-4">
        <Card className="w-full backdrop-blur-md bg-background/40 shadow-lg shadow-neutral-600/5 border border-primary/10">
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
              <ul className="space-y-4">
                {tasks.map((task: Task) => (
                  <li key={task._id} className="bg-background/60 p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold">{task.title}</h2>
                    <p className="text-muted-foreground">{task.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">Status: {task.status}</span>
                      <span className="text-sm bg-secondary/10 text-secondary px-2 py-1 rounded-full">Priority: {task.priority}</span>
                      {task.dueDate && (
                        <span className="text-sm bg-accent/10 text-accent px-2 py-1 rounded-full">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Tasks;