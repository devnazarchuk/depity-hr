'use client';

import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { OnboardingCard } from '@/components/onboarding/OnboardingCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserPlus, Search, Clock, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function OnboardingPage() {
  const { onboardingTasks, users } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTasks = onboardingTasks.filter(task => {
    const user = users.find(u => u.id === task.userId);
    const matchesSearch = user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user?.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const pendingCount = onboardingTasks.filter(t => t.status === 'pending').length;
  const inProgressCount = onboardingTasks.filter(t => t.status === 'in-progress').length;
  const completedCount = onboardingTasks.filter(t => t.status === 'completed').length;
  const overdueCount = onboardingTasks.filter(t => t.status === 'overdue').length;

  const averageProgress = onboardingTasks.length > 0 
    ? Math.round(onboardingTasks.reduce((sum, task) => sum + task.progress, 0) / onboardingTasks.length)
    : 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Onboarding</h1>
            <p className="text-muted-foreground">
              Track and manage employee onboarding progress
            </p>
          </div>
          
          <Button className="mt-4 sm:mt-0">
            <UserPlus className="mr-2 h-4 w-4" />
            Start Onboarding
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="In Progress"
            value={inProgressCount}
            description="Active onboarding"
            icon={Clock}
            change={{ value: 15, type: 'increase' }}
          />
          <StatsCard
            title="Completed"
            value={completedCount}
            description="Finished onboarding"
            icon={CheckCircle}
            change={{ value: 8, type: 'increase' }}
          />
          <StatsCard
            title="Overdue"
            value={overdueCount}
            description="Need attention"
            icon={AlertTriangle}
            change={{ value: 12, type: 'decrease' }}
          />
          <StatsCard
            title="Average Progress"
            value={`${averageProgress}%`}
            description="Completion rate"
            icon={Users}
            change={{ value: 5, type: 'increase' }}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by employee name or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Onboarding Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredTasks.map((task) => {
            const user = users.find(u => u.id === task.userId);
            return user ? (
              <OnboardingCard key={task.id} task={task} user={user} />
            ) : null;
          })}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <UserPlus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No onboarding tasks found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? 'Try adjusting your search criteria' 
                : 'Start onboarding new employees to see progress here.'}
            </p>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Start New Onboarding
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}