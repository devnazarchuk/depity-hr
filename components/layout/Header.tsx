'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Bell, Search, Settings, LogOut, User, Timer, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export function Header({ onToggleSidebar, sidebarCollapsed }: HeaderProps) {
  const { currentUser, logout, sessionTimeLeft, sessionSettings, extendSession } = useApp();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleExtendSession = () => {
    extendSession();
    toast({
      title: "Session Extended",
      description: "Your session has been extended successfully.",
    });
  };

  // Format time left for display
  const formatTimeLeft = (seconds: number): string => {
    if (seconds <= 0) return 'Expired';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Get session status color
  const getSessionStatusColor = (seconds: number): 'default' | 'destructive' | 'warning' => {
    if (seconds <= 0) return 'destructive';
    if (seconds < 300) return 'destructive'; // Less than 5 minutes
    if (seconds < 900) return 'warning'; // Less than 15 minutes
    return 'default';
  };

  // Show warning toast when session is about to expire
  useEffect(() => {
    if (sessionTimeLeft > 0 && sessionTimeLeft <= 300) {
      // Show warning at specific intervals: 5min, 3min, 2min, 1min
      const warningTimes = [300, 180, 120, 60];
      if (warningTimes.includes(sessionTimeLeft)) {
        const minutes = Math.floor(sessionTimeLeft / 60);
        toast({
          title: "Session Expiring Soon",
          description: `Your session will expire in ${minutes} minute${minutes > 1 ? 's' : ''}.`,
          variant: "warning",
        });
      }
    }
  }, [sessionTimeLeft, toast]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleSidebar}
        className="h-9 w-9 p-0"
      >
        <Menu className="h-4 w-4" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      {/* Search */}
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search employees, documents..." 
            className="pl-10"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Session Timer - Only show if enabled */}
        {sessionSettings.showSessionTimer && sessionTimeLeft > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg">
                  <Timer className="h-4 w-4 text-muted-foreground" />
                  <Badge variant={getSessionStatusColor(sessionTimeLeft)} className="text-xs">
                    {formatTimeLeft(sessionTimeLeft)}
                  </Badge>
                  {sessionTimeLeft < 900 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleExtendSession}
                      className="h-6 w-6 p-0 hover:bg-primary/10"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Session expires in {formatTimeLeft(sessionTimeLeft)}</p>
                {sessionTimeLeft < 900 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Click refresh to extend session
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* Logout Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="h-9 w-9 p-0 shadow-lg hover:shadow-xl transition-shadow duration-200"
        >
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Sign Out</span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                <AvatarFallback>
                  {currentUser?.name?.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{currentUser?.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{currentUser?.role} • {currentUser?.department}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}