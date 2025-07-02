'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  UserPlus, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';
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

export function HRDashboard() {
  const { currentUser, getDashboardStats, users } = useApp();
  const router = useRouter();
  const stats = getDashboardStats();

  const onboardingData = [
    { name: 'In Progress', value: stats.inProgressOnboarding, color: '#3B82F6' },
    { name: 'Completed', value: stats.completedOnboarding, color: '#10B981' },
    { name: 'Pending', value: stats.totalOnboarding - stats.inProgressOnboarding - stats.completedOnboarding, color: '#F59E0B' },
    { name: 'Overdue', value: stats.overdueOnboarding, color: '#EF4444' },
  ];

  const recentEmployees = stats.recentlyAddedEmployees || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          HR Dashboard
        </h1>
        <p className="text-green-100">
          Manage onboarding, employees, and HR processes across the organization.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats.activeEmployees}</span> active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Onboarding</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgressOnboarding}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">+{stats.overdueOnboarding}</span> overdue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Onboarding Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageOnboardingDuration}</div>
            <p className="text-xs text-muted-foreground">
              days to complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentActivity}</div>
            <p className="text-xs text-muted-foreground">
              updates this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Onboarding Status</CardTitle>
            <CardDescription>Distribution of onboarding progress</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={onboardingData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {onboardingData.map((entry, index) => (
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
            <CardTitle>Recently Added Employees</CardTitle>
            <CardDescription>New hires in the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEmployees.length > 0 ? (
                recentEmployees.map((employee: any) => (
                  <div key={employee.id} className="flex items-center space-x-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={employee.avatar} />
                      <AvatarFallback>{employee.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{employee.name}</p>
                      <p className="text-xs text-muted-foreground">{employee.department}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {new Date(employee.joinDate).toLocaleDateString()}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No new employees added recently
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common HR tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 md:grid-cols-2">
            <Button
              onClick={() => router.push('/team')}
              variant="outline"
              className="justify-start"
            >
              <Users className="h-4 w-4 mr-2" />
              Manage Employees
            </Button>
            
            <Button
              onClick={() => router.push('/onboarding')}
              variant="outline"
              className="justify-start"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Manage Onboarding
            </Button>
            
            <Button
              onClick={() => router.push('/documents')}
              variant="outline"
              className="justify-start"
            >
              <FileText className="h-4 w-4 mr-2" />
              Manage Documents
            </Button>
            
            <Button
              onClick={() => router.push('/settings')}
              variant="outline"
              className="justify-start"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              HR Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 