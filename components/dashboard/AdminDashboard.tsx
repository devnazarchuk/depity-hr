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
  Shield, 
  Settings, 
  TrendingUp,
  BarChart3,
  Building,
  Activity,
  Database
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

export function AdminDashboard() {
  const { currentUser, getDashboardStats, users } = useApp();
  const router = useRouter();
  const stats = getDashboardStats();

  const roleData = [
    { name: 'Employees', value: stats.roleDistribution?.employees || 0, color: '#10B981' },
    { name: 'Managers', value: stats.roleDistribution?.managers || 0, color: '#8B5CF6' },
    { name: 'HR', value: stats.roleDistribution?.hr || 0, color: '#3B82F6' },
    { name: 'Admins', value: stats.roleDistribution?.admins || 0, color: '#EF4444' },
  ];

  const departmentData = Object.entries(stats.departmentStats || {}).map(([dept, count]) => ({
    name: dept,
    employees: count,
  }));

  const recentUsers = users.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Admin Dashboard
        </h1>
        <p className="text-red-100">
          Complete system overview and management across all departments and users.
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
              <span className="text-blue-600">+{stats.completedOnboarding}</span> completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDocuments}</div>
            <p className="text-xs text-muted-foreground">
              stored files
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle>Role Distribution</CardTitle>
            <CardDescription>Employee distribution by role</CardDescription>
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
            <CardDescription>Employee count by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  axisLine={true}
                  tickLine={true}
                  tick={{ fontSize: 12 }}
                  type="category"
                />
                <YAxis 
                  axisLine={true}
                  tickLine={true}
                  tick={{ fontSize: 12 }}
                  type="number"
                />
                <Tooltip />
                <Bar dataKey="employees" fill="#3B82F6" name="Employees" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Platform health and metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Users</span>
              <Badge variant="default">{stats.activeEmployees}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Inactive Users</span>
              <Badge variant="secondary">{stats.inactiveEmployees}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Pending Users</span>
              <Badge variant="outline">{stats.pendingEmployees}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Storage Used</span>
              <Badge variant="outline">2.4 GB</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest additions to the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.department} • {user.role}</p>
                  </div>
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                    {user.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>System-wide management tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            <Button
              onClick={() => router.push('/team')}
              variant="outline"
              className="justify-start"
            >
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            
            <Button
              onClick={() => router.push('/access')}
              variant="outline"
              className="justify-start"
            >
              <Shield className="h-4 w-4 mr-2" />
              Access Control
            </Button>
            
            <Button
              onClick={() => router.push('/onboarding')}
              variant="outline"
              className="justify-start"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Onboarding
            </Button>
            
            <Button
              onClick={() => router.push('/documents')}
              variant="outline"
              className="justify-start"
            >
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </Button>
            
            <Button
              onClick={() => router.push('/settings')}
              variant="outline"
              className="justify-start"
            >
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </Button>
            
            <Button
              onClick={() => router.push('/profile')}
              variant="outline"
              className="justify-start"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 