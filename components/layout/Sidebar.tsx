'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  FileText, 
  UserPlus, 
  Shield, 
  Settings,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Onboarding', href: '/onboarding', icon: UserPlus },
  { name: 'Access Control', href: '/access', icon: Shield },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

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
      </div>
    </aside>
  );
}