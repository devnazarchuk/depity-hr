'use client';

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Shield, 
  Palette, 
  Clock, 
  RefreshCw, 
  Eye, 
  EyeOff,
  Timer,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsPage() {
  const { currentUser, updateUser, hasPermission, resetData, sessionSettings, updateSessionSettings, sessionTimeLeft, extendSession } = useApp();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    onboardingUpdates: true,
    documentChanges: true,
    teamUpdates: false,
    weeklyReports: true
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    passwordExpiry: '90d',
    loginNotifications: true
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'UTC-5'
  });

  // Format time left for display
  const formatTimeLeft = (seconds: number): string => {
    if (seconds <= 0) return 'Expired';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
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

  const handleExtendSession = () => {
    extendSession();
    toast({
      title: "Session Extended",
      description: "Your session has been extended successfully.",
    });
  };

  const handleSessionTimeoutChange = (value: string) => {
    const timeout = parseInt(value);
    updateSessionSettings({ sessionTimeout: timeout });
    toast({
      title: "Session Timeout Updated",
      description: `Session timeout changed to ${timeout} minutes.`,
    });
  };

  if (!hasPermission('settings_view')) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to view settings.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="security" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            {/* Session Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Timer className="mr-2 h-5 w-5" />
                  Session Management
                </CardTitle>
                <CardDescription>
                  Manage your session timeout and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Session Status */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Current Session</Label>
                    <p className="text-sm text-muted-foreground">
                      Time remaining until automatic logout
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={getSessionStatusColor(sessionTimeLeft)} className="mb-2 flex items-center gap-1">
                      {formatTimeLeft(sessionTimeLeft)}
                      {sessionSettings.autoRefresh && <RefreshCw className="ml-1 h-4 w-4 animate-spin text-blue-500" />}
                    </Badge>
                    <Button 
                      size="sm" 
                      onClick={handleExtendSession}
                      className="w-full"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Extend Session
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Session Timeout */}
                <div className="space-y-2">
                  <Label>Session Timeout</Label>
                  <Select 
                    value={sessionSettings.sessionTimeout.toString()} 
                    onValueChange={handleSessionTimeoutChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 minute (test)</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="480">8 hours</SelectItem>
                      <SelectItem value="1440">24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    How long your session stays active before automatic logout.
                  </p>
                </div>

                {/* Auto Refresh */}
                <div className="flex items-center gap-2 mt-4">
                  <Switch
                    checked={sessionSettings.autoRefresh}
                    onCheckedChange={v => updateSessionSettings({ autoRefresh: v })}
                    id="auto-refresh-switch"
                  />
                  <Label htmlFor="auto-refresh-switch">Auto Refresh Session</Label>
                </div>

                {/* Show Session Timer */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Show Session Timer</Label>
                    <p className="text-sm text-muted-foreground">
                      Display remaining session time in the interface
                    </p>
                  </div>
                  <Switch
                    checked={sessionSettings.showSessionTimer}
                    onCheckedChange={(checked) => 
                      updateSessionSettings({ showSessionTimer: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure additional security measures for your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={security.twoFactorAuth}
                    onCheckedChange={(checked) => 
                      setSecurity(prev => ({ ...prev, twoFactorAuth: checked }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Password Expiry</Label>
                  <Select value={security.passwordExpiry} onValueChange={(value) => 
                    setSecurity(prev => ({ ...prev, passwordExpiry: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30d">30 days</SelectItem>
                      <SelectItem value="60d">60 days</SelectItem>
                      <SelectItem value="90d">90 days</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Login Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified of new login attempts
                    </p>
                  </div>
                  <Switch
                    checked={security.loginNotifications}
                    onCheckedChange={(checked) => 
                      setSecurity(prev => ({ ...prev, loginNotifications: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose which notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive browser push notifications
                    </p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, pushNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Onboarding Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about onboarding progress
                    </p>
                  </div>
                  <Switch
                    checked={notifications.onboardingUpdates}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, onboardingUpdates: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Document Changes</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when documents are added or modified
                    </p>
                  </div>
                  <Switch
                    checked={notifications.documentChanges}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, documentChanges: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Team Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about team member changes
                    </p>
                  </div>
                  <Switch
                    checked={notifications.teamUpdates}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, teamUpdates: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly summary reports
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, weeklyReports: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="mr-2 h-5 w-5" />
                  Display & Language
                </CardTitle>
                <CardDescription>
                  Customize your display preferences and language
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={preferences.language} onValueChange={(value) => 
                    setPreferences(prev => ({ ...prev, language: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={preferences.timezone} onValueChange={(value) => 
                    setPreferences(prev => ({ ...prev, timezone: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0">UTC</SelectItem>
                      <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                      <SelectItem value="UTC+8">China Standard Time (UTC+8)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Manage your data and reset settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="destructive" 
                  onClick={resetData}
                  className="w-full"
                >
                  Reset All Data
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  This will reset all application data to default values. This action cannot be undone.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
} 