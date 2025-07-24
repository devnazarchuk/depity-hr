import React, { useState } from 'react';
import { Settings, User, Bell, Shield, Palette, Globe, Moon, Sun, Monitor } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    meetings: true,
    timeOff: true,
    tasks: false
  });
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC-8');

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20 p-4 sm:p-6 lg:p-8 bg-fixed">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl backdrop-blur-sm border border-purple-500/20">
              <Settings className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-gray-400 font-medium">Customize your experience</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Profile Settings */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Profile</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                <input
                  type="text"
                  defaultValue="Sophia Williams"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue="sophia@alignul.com"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>Product Management</option>
                  <option>Engineering</option>
                  <option>Design</option>
                  <option>Marketing</option>
                  <option>HR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>Manager</option>
                  <option>Employee</option>
                  <option>HR</option>
                </select>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <Palette className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Appearance</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">Theme</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'light', label: 'Light', icon: Sun },
                    { value: 'dark', label: 'Dark', icon: Moon },
                    { value: 'system', label: 'System', icon: Monitor }
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setTheme(value as any)}
                      className={`p-4 rounded-xl border transition-all duration-300 flex flex-col items-center space-y-2 ${
                        theme === value
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
                { key: 'push', label: 'Push Notifications', description: 'Browser push notifications' },
                { key: 'meetings', label: 'Meeting Reminders', description: 'Get reminded about upcoming meetings' },
                { key: 'timeOff', label: 'Time Off Updates', description: 'Status updates on time off requests' },
                { key: 'tasks', label: 'Task Notifications', description: 'Updates on assigned tasks' }
              ].map(({ key, label, description }) => (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl">
                  <div>
                    <h3 className="font-semibold text-white">{label}</h3>
                    <p className="text-sm text-gray-400">{description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications[key as keyof typeof notifications]}
                      onChange={(e) => handleNotificationChange(key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Localization */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <Globe className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Localization</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
                <select 
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="UTC-8">Pacific Time (UTC-8)</option>
                  <option value="UTC-5">Eastern Time (UTC-5)</option>
                  <option value="UTC+0">UTC</option>
                  <option value="UTC+1">Central European Time (UTC+1)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Security</h2>
            </div>
            
            <div className="space-y-4">
              <button className="w-full text-left p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors">
                <h3 className="font-semibold text-white mb-1">Change Password</h3>
                <p className="text-sm text-gray-400">Update your account password</p>
              </button>
              <button className="w-full text-left p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors">
                <h3 className="font-semibold text-white mb-1">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-400">Add an extra layer of security</p>
              </button>
              <button className="w-full text-left p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors">
                <h3 className="font-semibold text-white mb-1">Active Sessions</h3>
                <p className="text-sm text-gray-400">Manage your active login sessions</p>
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;