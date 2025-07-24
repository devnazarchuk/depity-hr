'use client';

import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { UserCard } from '@/components/team/UserCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserPlus, Search, Filter } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function TeamPage() {
  const { 
    users, 
    hasPermission, 
    getUsersForRole, 
    canEditUser,
    currentUser 
  } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);

  // Get role-filtered users
  const roleFilteredUsers = getUsersForRole();

  const filteredUsers = roleFilteredUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Check permissions
  const canAddEmployee = hasPermission('team_add_employee');
  const canEditTeam = hasPermission('team_edit') || hasPermission('team_edit_own') || hasPermission('team_edit_all');

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {currentUser?.role === 'employee' ? 'My Profile' : 'Team'}
            </h1>
            <p className="text-muted-foreground">
              {currentUser?.role === 'employee' 
                ? 'View and manage your profile information'
                : 'Manage your team members and their roles'
              }
            </p>
          </div>
          
          {canAddEmployee && (
            <Button className="mt-4 sm:mt-0" onClick={() => setShowAddEmployeeModal(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          )}
        </div>

        {/* Filters - Only show for non-employee roles */}
        {currentUser?.role !== 'employee' && (
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Team Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <UserCard 
              key={user.id} 
              user={user} 
              canEdit={canEditUser(user.id)}
            />
          ))}
        </div>

        {/* Info for limited permissions */}
        {currentUser?.role === 'hr' && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Note:</strong> You can view team members but cannot edit their information on this page. 
              Use the Access Control page to manage user roles and permissions.
            </p>
          </div>
        )}
        
        {!canEditTeam && currentUser?.role !== 'employee' && currentUser?.role !== 'hr' && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Note:</strong> You can view team members but cannot edit their information. 
              Contact HR or Admin for changes.
            </p>
          </div>
        )}

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No employees found</h3>
            <p className="text-muted-foreground">
              {currentUser?.role === 'employee' 
                ? 'No profile information available.'
                : 'Try adjusting your search criteria or add new team members.'
              }
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}