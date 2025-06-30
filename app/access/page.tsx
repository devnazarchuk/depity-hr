'use client';

import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Shield, Users, Settings, Edit } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

interface RolePermissions {
  [key: string]: {
    [key: string]: boolean;
  };
}

const permissions: Permission[] = [
  { id: 'dashboard_view', name: 'View Dashboard', description: 'Access to main dashboard', module: 'Dashboard' },
  { id: 'team_view', name: 'View Team', description: 'View team members list', module: 'Team' },
  { id: 'team_edit', name: 'Edit Team', description: 'Edit user roles and information', module: 'Team' },
  { id: 'documents_view', name: 'View Documents', description: 'Access document library', module: 'Documents' },
  { id: 'documents_upload', name: 'Upload Documents', description: 'Upload new documents', module: 'Documents' },
  { id: 'documents_delete', name: 'Delete Documents', description: 'Delete documents and folders', module: 'Documents' },
  { id: 'onboarding_view', name: 'View Onboarding', description: 'Access onboarding dashboard', module: 'Onboarding' },
  { id: 'onboarding_manage', name: 'Manage Onboarding', description: 'Update onboarding status', module: 'Onboarding' },
  { id: 'access_view', name: 'View Access Control', description: 'View permission settings', module: 'Access Control' },
  { id: 'access_manage', name: 'Manage Access Control', description: 'Modify user permissions', module: 'Access Control' },
];

const initialRolePermissions: RolePermissions = {
  admin: {
    dashboard_view: true,
    team_view: true,
    team_edit: true,
    documents_view: true,
    documents_upload: true,
    documents_delete: true,
    onboarding_view: true,
    onboarding_manage: true,
    access_view: true,
    access_manage: true,
  },
  hr: {
    dashboard_view: true,
    team_view: true,
    team_edit: true,
    documents_view: true,
    documents_upload: true,
    documents_delete: false,
    onboarding_view: true,
    onboarding_manage: true,
    access_view: true,
    access_manage: false,
  },
  manager: {
    dashboard_view: true,
    team_view: true,
    team_edit: false,
    documents_view: true,
    documents_upload: true,
    documents_delete: false,
    onboarding_view: true,
    onboarding_manage: false,
    access_view: false,
    access_manage: false,
  },
  employee: {
    dashboard_view: true,
    team_view: true,
    team_edit: false,
    documents_view: true,
    documents_upload: false,
    documents_delete: false,
    onboarding_view: false,
    onboarding_manage: false,
    access_view: false,
    access_manage: false,
  },
};

export default function AccessPage() {
  const { users, updateUser } = useApp();
  const [rolePermissions, setRolePermissions] = useState<RolePermissions>(initialRolePermissions);
  const [selectedUser, setSelectedUser] = useState<string>('');

  const handlePermissionToggle = (role: string, permissionId: string) => {
    setRolePermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permissionId]: !prev[role]?.[permissionId]
      }
    }));
  };

  const handleUserRoleChange = (userId: string, newRole: string) => {
    updateUser(userId, { role: newRole as any });
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as { [key: string]: Permission[] });

  const roleColors = {
    admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    hr: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    manager: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    employee: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Access Control</h1>
          <p className="text-muted-foreground">
            Manage user roles and permissions across the platform
          </p>
        </div>

        {/* User Role Assignment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              User Role Assignment
            </CardTitle>
            <CardDescription>
              Assign and modify user roles for access control
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge className={roleColors[user.role]} variant="secondary">
                      {user.role}
                    </Badge>
                    
                    <Select
                      value={user.role}
                      onValueChange={(newRole) => handleUserRoleChange(user.id, newRole)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Permission Matrix */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Permission Matrix
            </CardTitle>
            <CardDescription>
              Configure permissions for each role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
                <div key={module} className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">{module}</h3>
                  
                  <div className="grid gap-4">
                    {modulePermissions.map((permission) => (
                      <div key={permission.id} className="border rounded-lg p-4">
                        <div className="mb-3">
                          <h4 className="font-medium">{permission.name}</h4>
                          <p className="text-sm text-muted-foreground">{permission.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {['admin', 'hr', 'manager', 'employee'].map((role) => (
                            <div key={role} className="flex items-center justify-between">
                              <Badge className={roleColors[role as keyof typeof roleColors]} variant="secondary">
                                {role}
                              </Badge>
                              <Switch
                                checked={rolePermissions[role]?.[permission.id] || false}
                                onCheckedChange={() => handlePermissionToggle(role, permission.id)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Role Summary */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {['admin', 'hr', 'manager', 'employee'].map((role) => {
            const rolePerms = rolePermissions[role] || {};
            const enabledPermissions = Object.values(rolePerms).filter(Boolean).length;
            const totalPermissions = permissions.length;
            
            return (
              <Card key={role}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <Badge className={roleColors[role as keyof typeof roleColors]} variant="secondary">
                      {role}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {enabledPermissions}/{totalPermissions}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Permissions enabled
                    </p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {Math.round((enabledPermissions / totalPermissions) * 100)}% access level
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}