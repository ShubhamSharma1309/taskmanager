import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import { TaskSchema, Task } from '@/lib/types/tasks';


export default function useCreateTask() {
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
            console.log('Cookies before fetch:', document.cookie);

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
                toast({
                    title: "Success",
                    description: "Task created successfully",
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


    return{
        handleSubmit,
        handleChange,
        handleSelectChange,
        toast,
        currentUser,
        errors,
        formData

    }
}