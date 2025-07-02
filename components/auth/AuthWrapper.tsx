'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { currentUser, isAuthenticated, sessionTimeLeft, extendSession, sessionSettings, isSessionLoading } = useApp();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [showSessionWarning, setShowSessionWarning] = useState(false);

  useEffect(() => {
    if (isSessionLoading) return; // Чекаємо завершення перевірки сесії
    // Skip auth check for login page
    if (pathname === '/login') {
      setIsLoading(false);
      return;
    }

    // Check if user is authenticated
    if (!currentUser && !isAuthenticated) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [currentUser, isAuthenticated, pathname, router, isSessionLoading]);

  // Session warning logic
  useEffect(() => {
    if (!isAuthenticated || pathname === '/login') return;

    // Show warning when session is about to expire (5 minutes left)
    if (sessionTimeLeft > 0 && sessionTimeLeft <= 300) {
      // Show warning at specific intervals: 5min, 3min, 2min, 1min
      const warningTimes = [300, 180, 120, 60];
      if (warningTimes.includes(sessionTimeLeft)) {
        const minutes = Math.floor(sessionTimeLeft / 60);
        
        // Show dialog for critical time (1-2 minutes)
        if (sessionTimeLeft <= 120) {
          setShowSessionWarning(true);
        } else {
          // Show toast for longer warnings
          toast({
            title: "Session Expiring Soon",
            description: `Your session will expire in ${minutes} minute${minutes > 1 ? 's' : ''}. Click "Extend Session" to continue.`,
            variant: "warning",
            duration: 10000,
          });
        }
      }
    }
  }, [sessionTimeLeft, isAuthenticated, pathname, toast]);

  const handleExtendSession = () => {
    extendSession();
    setShowSessionWarning(false);
    toast({
      title: "Session Extended",
      description: "Your session has been extended successfully.",
    });
  };

  const handleLogout = () => {
    setShowSessionWarning(false);
    // The logout will be handled by the session timer
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render layout for login page
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // Render protected content
  return (
    <>
      {children}
      
      {/* Session Warning Dialog */}
      <AlertDialog open={showSessionWarning} onOpenChange={setShowSessionWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Session Expiring Soon</AlertDialogTitle>
            <AlertDialogDescription>
              Your session will expire in {Math.floor(sessionTimeLeft / 60)} minute{Math.floor(sessionTimeLeft / 60) > 1 ? 's' : ''}. 
              Would you like to extend your session to continue working?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleLogout}>
              Logout Now
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleExtendSession}>
              Extend Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 