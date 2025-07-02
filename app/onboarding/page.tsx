'use client';

import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { OnboardingCard } from '@/components/onboarding/OnboardingCard';
import { StartOnboardingModal } from '@/components/onboarding/StartOnboardingModal';
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
  const { 
    onboardingTasks, 
    users, 
    startOnboarding, 
    hasPermission,
    getOnboardingTasksForRole,
    canAccessOnboarding,
    currentUser
  } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showStartOnboarding, setShowStartOnboarding] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');

  // Get role-filtered onboarding tasks
  const roleFilteredTasks = getOnboardingTasksForRole();

  // Check if user has access to this page
  if (!hasPermission('onboarding_view') && !hasPermission('onboarding_view_all') && !hasPermission('onboarding_view_team')) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const filteredTasks = roleFilteredTasks.filter(task => {
    const user = users.find(u => u.id === task.userId);
    const matchesSearch = user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user?.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const pendingCount = roleFilteredTasks.filter(t => t.status === 'pending').length;
  const inProgressCount = roleFilteredTasks.filter(t => t.status === 'in-progress').length;
  const completedCount = roleFilteredTasks.filter(t => t.status === 'completed').length;
  const overdueCount = roleFilteredTasks.filter(t => t.status === 'overdue').length;

  const averageProgress = roleFilteredTasks.length > 0 
    ? Math.round(roleFilteredTasks.reduce((sum, task) => sum + task.progress, 0) / roleFilteredTasks.length)
    : 0;

  // Check permissions
  const canManageOnboarding = hasPermission('onboarding_manage') || hasPermission('onboarding_add_employee');

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {currentUser?.role === 'employee' ? 'My Onboarding' : 'Onboarding'}
            </h1>
            <p className="text-muted-foreground">
              {currentUser?.role === 'employee' 
                ? 'Track your onboarding progress and complete required tasks'
                : 'Track and manage employee onboarding progress'
              }
            </p>
          </div>
          
          {canManageOnboarding && (
            <Button className="mt-4 sm:mt-0" onClick={() => setShowStartOnboarding(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Start Onboarding
            </Button>
          )}
        </div>

        {/* Stats - Only show for non-employee roles */}
        {currentUser?.role !== 'employee' && (
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
        )}

        {/* Filters - Only show for non-employee roles */}
        {currentUser?.role !== 'employee' && (
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
        )}

        {/* Onboarding Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredTasks.map((task) => {
            const user = users.find(u => u.id === task.userId);
            return user ? (
              <OnboardingCard 
                key={task.id} 
                task={task} 
                user={user}
                canEdit={canAccessOnboarding(task.id)}
              />
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
              {currentUser?.role === 'employee' 
                ? 'No onboarding tasks assigned to you yet.'
                : searchTerm 
                  ? 'Try adjusting your search criteria' 
                  : 'Start onboarding new employees to see progress here.'
              }
            </p>
            {canManageOnboarding && (
              <Button onClick={() => setShowStartOnboarding(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Start New Onboarding
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Start Onboarding Modal */}
      {canManageOnboarding && (
        <StartOnboardingModal
          isOpen={showStartOnboarding}
          onClose={() => setShowStartOnboarding(false)}
          onStartOnboarding={startOnboarding}
        />
      )}

      {/* Info for view-only users */}
      {!canManageOnboarding && currentUser?.role !== 'employee' && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-300">
            <strong>Note:</strong> You can view onboarding progress but cannot manage tasks. 
            Contact HR or Admin for onboarding management.
          </p>
        </div>
      )}
    </Layout>
  );
}