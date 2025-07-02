'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { OnboardingTask, useApp } from '@/contexts/AppContext';

interface OnboardingCardProps {
  task: OnboardingTask;
  user: any;
  canEdit?: boolean;
}

const statusConfig = {
  pending: {
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    icon: Clock
  },
  'in-progress': {
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    icon: Clock
  },
  completed: {
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    icon: CheckCircle
  },
  overdue: {
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    icon: AlertTriangle
  }
};

export function OnboardingCard({ task, user, canEdit = false }: OnboardingCardProps) {
  const { updateOnboardingStatus, completeOnboardingTask } = useApp();
  const config = statusConfig[task.status];
  const StatusIcon = config.icon;

  const completedTasks = task.tasks.filter(t => t.completed).length;
  const totalTasks = task.tasks.length;

  const handleStatusChange = (newStatus: OnboardingTask['status']) => {
    updateOnboardingStatus(task.id, newStatus);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{user.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{user.department}</p>
            </div>
          </div>
          
          {canEdit ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Badge className={config.color} variant="secondary">
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {task.status.replace('-', ' ')}
                  </Badge>
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusChange('pending')}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('in-progress')}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('overdue')}>
                  Overdue
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Badge className={config.color} variant="secondary">
              <StatusIcon className="w-3 h-3 mr-1" />
              {task.status.replace('-', ' ')}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{completedTasks}/{totalTasks} tasks</span>
            </div>
            <Progress value={task.progress} max={100} className="h-2" />
          </div>
          
                      <div className="space-y-2">
            <h4 className="font-medium text-sm">Tasks:</h4>
            {task.tasks.slice(0, 3).map((subtask) => (
              <div 
                key={subtask.id} 
                className={`flex items-center space-x-2 text-sm ${
                  canEdit ? 'cursor-pointer hover:bg-accent p-1 rounded' : ''
                }`}
                onClick={() => canEdit && completeOnboardingTask(task.id, subtask.id)}
              >
                <CheckCircle 
                  className={`h-4 w-4 ${
                    subtask.completed 
                      ? 'text-green-600' 
                      : 'text-gray-400'
                  }`} 
                />
                <span className={subtask.completed ? 'line-through text-muted-foreground' : ''}>
                  {subtask.name}
                </span>
                {subtask.dueDate && (
                  <span className="text-xs text-muted-foreground ml-auto">
                    Due {new Date(subtask.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            ))}
            {task.tasks.length > 3 && (
              <p className="text-xs text-muted-foreground">
                +{task.tasks.length - 3} more tasks
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}