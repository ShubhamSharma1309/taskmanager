"use client"
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Task, TTasks } from '@/lib/types/tasks';
import { useToast } from '@/hooks/use-toast';

const TasksPage = () => {
  const [tasks, setTasks] = useState<Tasks>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state: any) => state.user);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        console.log('Cookies before fetch:', document.cookie);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks/getAll`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        console.log('Response headers:', response.headers);
        console.log('Response status:', response.status);

        if (response.status === 401) {
          console.error('Unauthorized: Cookie might not have been sent or is invalid');
          throw new Error('Unauthorized');
        }

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

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="container mx-auto p-4 text-black">
      <h1 className="text-2xl font-bold mb-4">Your Tasks</h1>
      {tasks.length === 0 ? (
        <p>No tasks found. Start by creating a new task!</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task: Task) => (
            <li key={task._id} className="bg-gray-100 p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p className="text-gray-600">{task.description}</p>
              <div className="mt-2">
                <span className="mr-2">Status: {task.status}</span>
                <span className="mr-2">Priority: {task.priority}</span>
                {task.dueDate && (
                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TasksPage;