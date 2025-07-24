'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Users, 
  FileText, 
  UserPlus, 
  Shield, 
  Settings,
  Moon,
  Sun,
  User,
  LogOut
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home, permission: 'dashboard_view' },
  { name: 'Team', href: '/team', icon: Users, permission: 'team_view_all', roles: ['admin', 'hr', 'manager'] },
  { name: 'Documents', href: '/documents', icon: FileText, permission: 'documents_view_all', roles: ['admin', 'hr', 'manager', 'employee'] },
  { name: 'Onboarding', href: '/onboarding', icon: UserPlus, permission: 'onboarding_view_own', roles: ['admin', 'hr', 'manager', 'employee'] },
  { name: 'Access Control', href: '/access', icon: Shield, permission: 'access_control_view', roles: ['admin'] },
  { name: 'Profile Settings', href: '/profile', icon: User, permission: 'profile_edit_own', roles: ['admin', 'hr', 'manager', 'employee'] },
  { name: 'Settings', href: '/settings', icon: Settings, permission: 'settings_view', roles: ['admin', 'hr', 'manager'] },
];

export function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { hasPermission, logout, currentUser } = useApp();
  const router = useRouter();

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center px-6 border-b border-border">
          {!collapsed && (
            <h1 className="text-xl font-bold text-foreground">
              HR Platform
            </h1>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">HR</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const hasAccess = hasPermission(item.permission);
            const hasRoleAccess = !item.roles || (currentUser && item.roles.includes(currentUser.role));
            
            if (!hasAccess || !hasRoleAccess) return null;
            
            return (
              <Link key={item.name} href={item.href}>
                <div className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  collapsed && "justify-center"
                )}>
                  <item.icon className={cn("h-5 w-5 flex-shrink-0", !collapsed && "mr-3")} />
                  {!collapsed && item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle */}
        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className={cn(
              "w-full justify-start",
              collapsed && "justify-center px-2"
            )}
          >
            {theme === 'dark' ? (
              <Sun className={cn("h-4 w-4", !collapsed && "mr-2")} />
            ) : (
              <Moon className={cn("h-4 w-4", !collapsed && "mr-2")} />
            )}
            {!collapsed && (theme === 'dark' ? 'Light Mode' : 'Dark Mode')}
          </Button>
        </div>

        {/* Logout Button */}
        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className={cn(
              "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20",
              collapsed && "justify-center px-2"
            )}
          >
            <LogOut className={cn("h-4 w-4", !collapsed && "mr-2")} />
            {!collapsed && 'Sign Out'}
          </Button>
        </div>
      </div>
    </aside>
  );
}