import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Task } from '@/lib/types/tasks'
import { formatTaskAttribute } from '@/lib/utils'
import React from 'react'
import { useDrag } from 'react-dnd'

interface TaskProps extends Task {
    moveTask: (id: string, newStatus: string) => void;
}

export const TaskItem = ({ _id, title, description, status, priority, moveTask }: TaskProps) => {
    
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'Task',
        item: { _id, title, description, status, priority, userId: '', createdAt: new Date(), updatedAt: new Date() },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }))

    return (
        <div
            ref={drag as unknown as React.RefObject<HTMLDivElement>}
            className={`opacity-${isDragging ? '50' : '100'} cursor-move mb-4`}
        >
            <Card className="backdrop-blur-md bg-background/80 shadow-sm border border-primary/10">
                <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                </CardHeader>
                <CardContent className="backdrop-blur-md bg-background/80 p-4 pt-0">
                    <p className="text-xs text-muted-foreground mb-2">{description.slice(0, 50)}...</p>
                    <div className="flex justify-between items-center">
                        <Badge variant={status === 'COMPLETED' ? 'default' : 'secondary'} className={`
                backdrop-blur-sm text-white font-medium text-xs
                ${status === 'COMPLETED' ? 'bg-green-500/70' :
                                status === 'IN_PROGRESS' ? 'bg-yellow-500/70' : 'bg-blue-500/70'}
              `}>
                            {formatTaskAttribute(status)}
                        </Badge>
                        <Badge variant={priority === 'HIGH' ? 'destructive' : 'outline'} className={`
                backdrop-blur-sm text-white font-medium text-xs
                ${priority === 'HIGH' ? 'bg-red-500/70' :
                                priority === 'MEDIUM' ? 'bg-yellow-500/70' : 'bg-green-500/70'}
              `}>
                            {priority}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}