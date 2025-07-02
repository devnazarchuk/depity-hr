'use client';

import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { EmployeeDashboard } from '@/components/dashboard/EmployeeDashboard';
import { HRDashboard } from '@/components/dashboard/HRDashboard';
import { ManagerDashboard } from '@/components/dashboard/ManagerDashboard';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { useApp } from '@/contexts/AppContext';

export default function Dashboard() {
  const { currentUser, isAuthenticated, isSessionLoading, hasPermission } = useApp();

  // Show loading state while session is being restored
  if (isSessionLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !currentUser) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-muted-foreground">Please log in to access the dashboard.</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Render role-specific dashboard
  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'employee':
        return <EmployeeDashboard />;
      case 'hr':
        return <HRDashboard />;
      case 'manager':
        return <ManagerDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <EmployeeDashboard />;
    }
  };

  return (
    <Layout>
      {/* Debug Info - Only show in development */}
      {process.env.NODE_ENV === 'development' && currentUser && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-bold mb-2">Debug Info:</h3>
          <div className="text-sm space-y-1">
            <div><strong>User:</strong> {currentUser.name} ({currentUser.role})</div>
            <div><strong>Email:</strong> {currentUser.email}</div>
            <div><strong>Department:</strong> {currentUser.department}</div>
            <div><strong>Has team_view_all:</strong> {hasPermission('team_view_all') ? '✅' : '❌'}</div>
            <div><strong>Has documents_view_all:</strong> {hasPermission('documents_view_all') ? '✅' : '❌'}</div>
            <div><strong>Has onboarding_view_all:</strong> {hasPermission('onboarding_view_all') ? '✅' : '❌'}</div>
            <div><strong>Has access_control_view:</strong> {hasPermission('access_control_view') ? '✅' : '❌'}</div>
          </div>
        </div>
      )}
      
      {renderDashboard()}
    </Layout>
  );
}