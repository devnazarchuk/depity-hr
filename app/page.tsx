'use client';

import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, FileText, Shield, TrendingUp } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function Dashboard() {
  const { users, onboardingTasks, documents } = useApp();

  const activeUsers = users.filter(user => user.status === 'active').length;
  const pendingUsers = users.filter(user => user.status === 'pending').length;
  const inProgressOnboarding = onboardingTasks.filter(task => task.status === 'in-progress').length;

  const roleData = [
    { name: 'Employees', value: users.filter(u => u.role === 'employee').length, color: '#10B981' },
    { name: 'Managers', value: users.filter(u => u.role === 'manager').length, color: '#8B5CF6' },
    { name: 'HR', value: users.filter(u => u.role === 'hr').length, color: '#3B82F6' },
    { name: 'Admins', value: users.filter(u => u.role === 'admin').length, color: '#EF4444' },
  ];

  const departmentData = [
    { name: 'Engineering', employees: 12, onboarding: 2 },
    { name: 'Marketing', employees: 8, onboarding: 1 },
    { name: 'Sales', employees: 15, onboarding: 3 },
    { name: 'HR', employees: 4, onboarding: 0 },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your team.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Employees"
            value={users.length}
            description="Active team members"
            icon={Users}
            change={{ value: 12, type: 'increase' }}
          />
          <StatsCard
            title="Active Onboarding"
            value={inProgressOnboarding}
            description="In progress"
            icon={UserPlus}
            change={{ value: 8, type: 'increase' }}
          />
          <StatsCard
            title="Documents"
            value={documents.length}
            description="Total files"
            icon={FileText}
            change={{ value: 5, type: 'increase' }}
          />
          <StatsCard
            title="Pending Reviews"
            value={pendingUsers}
            description="Awaiting approval"
            icon={Shield}
            change={{ value: 2, type: 'decrease' }}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Team Composition</CardTitle>
              <CardDescription>Distribution of roles across the organization</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Department Overview</CardTitle>
              <CardDescription>Employee count and onboarding status by department</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="employees" fill="#3B82F6" name="Employees" />
                  <Bar dataKey="onboarding" fill="#10B981" name="Onboarding" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed and Quick Actions */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <ActivityFeed />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full text-left p-3 rounded-md hover:bg-accent transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Add New Employee</p>
                    <p className="text-sm text-muted-foreground">Start onboarding process</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full text-left p-3 rounded-md hover:bg-accent transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Upload Documents</p>
                    <p className="text-sm text-muted-foreground">Add to document library</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full text-left p-3 rounded-md hover:bg-accent transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">View Reports</p>
                    <p className="text-sm text-muted-foreground">Analytics & insights</p>
                  </div>
                </div>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}