import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Activity {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  target: string;
  timestamp: string;
  type: 'user' | 'document' | 'onboarding' | 'access';
}

const mockActivities: Activity[] = [
  {
    id: '1',
    user: { name: 'Sarah Johnson', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150' },
    action: 'updated role for',
    target: 'Michael Chen',
    timestamp: '2 minutes ago',
    type: 'user'
  },
  {
    id: '2',
    user: { name: 'Emily Rodriguez', avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?w=150' },
    action: 'completed onboarding task',
    target: 'IT Setup',
    timestamp: '15 minutes ago',
    type: 'onboarding'
  },
  {
    id: '3',
    user: { name: 'Michael Chen', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=150' },
    action: 'uploaded document',
    target: 'Training Manual.pdf',
    timestamp: '1 hour ago',
    type: 'document'
  },
  {
    id: '4',
    user: { name: 'David Kim', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=150' },
    action: 'gained access to',
    target: 'Sales Reports',
    timestamp: '2 hours ago',
    type: 'access'
  }
];

const getActivityColor = (type: Activity['type']) => {
  switch (type) {
    case 'user': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'document': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'onboarding': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'access': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions across your organization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>
                  {activity.user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user.name}</span>
                    {' '}{activity.action}{' '}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <Badge variant="secondary" className={getActivityColor(activity.type)}>
                    {activity.type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}