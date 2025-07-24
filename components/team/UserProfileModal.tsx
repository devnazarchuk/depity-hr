'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, Mail, Phone, MapPin, Calendar, Building } from 'lucide-react';
import { User as UserType, useApp } from '@/contexts/AppContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
}

export function UserProfileModal({ isOpen, onClose, user }: UserProfileModalProps) {
  const { updateUser, hasPermission, canEditUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    role: (user?.role as UserType['role']) || 'employee',
    department: user?.department || '',
    status: (user?.status as UserType['status']) || 'active'
  });

  const handleSave = () => {
    if (user) {
      updateUser(user.id, formData);
      setIsEditing(false);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      role: (user?.role as UserType['role']) || 'employee',
      department: user?.department || '',
      status: (user?.status as UserType['status']) || 'active'
    });
    onClose();
  };

  if (!user) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            {isEditing ? 'Edit Profile' : 'User Profile'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update user information' : 'View user details and information'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              {isEditing ? (
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="text-lg font-semibold mb-2"
                />
              ) : (
                <h3 className="text-lg font-semibold">{user.name}</h3>
              )}
              <div className="flex items-center space-x-2">
                <Badge className={roleColors[user.role]} variant="secondary">
                  {user.role}
                </Badge>
                <Badge className={statusColors[user.status]} variant="secondary">
                  {user.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Label>
              {isEditing ? (
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              ) : (
                <p className="text-sm">{user.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                Phone
              </Label>
              {isEditing ? (
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              ) : (
                <p className="text-sm">{user.phone || 'Not provided'}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                Location
              </Label>
              {isEditing ? (
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              ) : (
                <p className="text-sm">{user.location || 'Not provided'}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Join Date
              </Label>
              <p className="text-sm">{new Date(user.joinDate).toLocaleDateString()}</p>
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center">
                <Building className="mr-2 h-4 w-4" />
                Department
              </Label>
              {isEditing ? (
                <Input
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                />
              ) : (
                <p className="text-sm">{user.department}</p>
              )}
            </div>
            
            {isEditing && (
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as any }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          {user && canEditUser(user.id) && (
            <>
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </>
          )}
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 