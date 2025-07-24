import React from 'react';
import { Search, Bell, Settings, Calendar, Plus } from 'lucide-react';

interface HeaderProps {
  onProfileClick?: () => void;
  onSearchClick?: () => void;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
  onScheduleClick?: () => void;
  onNewClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onProfileClick,
  onSearchClick,
  onNotificationsClick,
  onSettingsClick,
  onScheduleClick,
  onNewClick
}) => {
  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      console.log('Profile clicked');
    }
  };

  const handleSearchClick = () => {
    if (onSearchClick) {
      onSearchClick();
    } else {
      console.log('Search clicked');
    }
  };

  const handleNotificationsClick = () => {
    if (onNotificationsClick) {
      onNotificationsClick();
    } else {
      console.log('Notifications clicked');
    }
  };

  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    } else {
      console.log('Settings clicked');
    }
  };

  const handleScheduleClick = () => {
    if (onScheduleClick) {
      onScheduleClick();
    } else {
      console.log('Schedule clicked');
    }
  };

  const handleNewClick = () => {
    if (onNewClick) {
      onNewClick();
    } else {
      console.log('New clicked');
    }
  };

  return (
    <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 text-white px-4 sm:px-6 py-4 sticky top-0 z-30 lg:ml-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4 ml-16 lg:ml-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={handleProfileClick}
              className="group relative"
              title="View Profile"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face"
                alt="Sophia Williams"
                className="w-8 h-8 sm:w-10 md:w-12 sm:h-10 md:h-12 rounded-full ring-2 ring-purple-500/30 hover:ring-purple-400/50 transition-all duration-300 cursor-pointer object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            <div className="hidden sm:block">
              <p className="text-sm sm:text-base lg:text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Sophia Williams
              </p>
              <p className="text-xs sm:text-sm text-gray-400 flex items-center space-x-1">
                <span className="hidden md:inline">Welcome back to Depity</span>
                <span className="md:hidden">Welcome back</span>
                <span className="animate-bounce">👋</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <button 
            onClick={handleScheduleClick}
            className="hidden sm:flex bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25 items-center space-x-2 group"
            title="Open Calendar"
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden lg:inline">Schedule</span>
          </button>
          <button 
            onClick={handleNewClick}
            className="hidden sm:flex bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 rounded-xl font-medium transition-all duration-300 border border-white/10 hover:border-white/20 items-center space-x-2 group"
            title="Create New Item"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden lg:inline">New</span>
          </button>
          
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button 
              onClick={handleSearchClick}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors group"
              title="Search"
            >
              <div className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white transition-colors" />
              </div>
            </button>
            <button 
              onClick={handleNotificationsClick}
              className="relative p-2 rounded-lg hover:bg-gray-800 transition-colors group"
              title="Notifications"
            >
              <div className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white transition-colors" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg">
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  3
                </span>
              </div>
            </button>
            <button 
              onClick={handleSettingsClick}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors group"
              title="Settings"
            >
              <div className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white transition-colors" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
