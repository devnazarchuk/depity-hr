'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Mail, Phone, MapPin, Edit, User as UserIcon } from 'lucide-react';
import { User, useApp } from '@/contexts/AppContext';
import { UserProfileModal } from './UserProfileModal';

interface UserCardProps {
  user: User;
  canEdit?: boolean;
}

const roleColors = {
  admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  hr: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  manager: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  employee: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
};

const statusColors = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
};

export function UserCard({ user, canEdit = false }: UserCardProps) {
  const { updateUser } = useApp();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleRoleChange = (newRole: User['role']) => {
    updateUser(user.id, { role: newRole });
  };

  const handleStatusChange = (newStatus: User['status']) => {
    updateUser(user.id, { status: newStatus });
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={() => setShowProfileModal(true)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.department}</p>
            </div>
          </div>
          
          {canEdit ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setShowProfileModal(true); }}>
                  <UserIcon className="mr-2 h-4 w-4" />
                    View Profile
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => { e.stopPropagation(); setShowProfileModal(true); }}>
              <UserIcon className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{user.email}</span>
          </div>
          
          {user.phone && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{user.phone}</span>
            </div>
          )}
          
          {user.location && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{user.location}</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex space-x-2">
            {canEdit ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Badge className={roleColors[user.role]} variant="secondary">
                      {user.role}
                    </Badge>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleRoleChange('admin')}>
                      Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleChange('hr')}>
                      HR
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleChange('manager')}>
                      Manager
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleChange('employee')}>
                      Employee
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Badge className={statusColors[user.status]} variant="secondary">
                      {user.status}
                    </Badge>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleStatusChange('active')}>
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange('inactive')}>
                      Inactive
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange('pending')}>
                      Pending
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Badge className={roleColors[user.role]} variant="secondary">
                  {user.role}
                </Badge>
                <Badge className={statusColors[user.status]} variant="secondary">
                  {user.status}
                </Badge>
              </>
            )}
          </div>
          
          <span className="text-sm text-muted-foreground">
            Joined {new Date(user.joinDate).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>

    {/* User Profile Modal */}
    <UserProfileModal
      isOpen={showProfileModal}
      onClose={() => setShowProfileModal(false)}
      user={user}
    />
    </>
  );
}