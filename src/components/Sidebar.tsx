import React, { useState } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { 
  LayoutDashboard, 
  Calendar, 
  Clock, 
  FolderOpen, 
  Users, 
  StickyNote,
  Gift,
  FileText,
  Star,
  Settings,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  X
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
  mobileMenuOpen: boolean;
  onMobileMenuClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  onToggle, 
  currentPage, 
  onPageChange, 
  mobileMenuOpen, 
  onMobileMenuClose 
}) => {
  const { favorites, addToFavorites } = useFavorites();

  const handlePageChange = (page: string) => {
    onPageChange(page);
    addToFavorites(page);
    onMobileMenuClose(); // Close mobile menu when navigating
  };

  const mainNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: Calendar, label: 'Calendar' },
    { icon: Clock, label: 'Time Off' },
    { icon: FolderOpen, label: 'Projects' },
    { icon: Users, label: 'Team' },
    { icon: StickyNote, label: 'Notes' },
    { icon: Gift, label: 'Benefits', badge: 'NEW' },
    { icon: FileText, label: 'Documents' },
  ];

  const bottomItems = [
    { icon: Settings, label: 'Settings' },
    { icon: HelpCircle, label: 'Support' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex bg-gray-900/95 backdrop-blur-xl text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-56'} h-screen flex-col border-r border-white/10 fixed left-0 top-0 z-40`}>
        {/* Header */}
        <div className={`${isCollapsed ? 'p-3' : 'p-4'} border-b border-white/10 flex-shrink-0`}>
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-base bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Depity</h1>
                  <p className="text-xs text-purple-400 font-medium">HR Management</p>
                </div>
              </div>
            )}
            <button 
              onClick={onToggle}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-all duration-300 group"
            >
              {isCollapsed ? 
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" /> : 
                <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              }
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className={`${isCollapsed ? 'p-2' : 'p-3'}`}>
            {!isCollapsed && <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold px-2">WORKSPACE</p>}
            
            <nav className="space-y-1">
              {mainNavItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handlePageChange(item.label)}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'space-x-2.5 px-2.5 py-2'} rounded-lg transition-all duration-300 group relative ${
                    currentPage === item.label
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/25'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className={`w-4 h-4 transition-colors ${
                    currentPage === item.label ? 'text-white' : 'text-gray-500 group-hover:text-purple-400'
                  }`} />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left font-medium text-sm">{item.label}</span>
                      {item.badge && (
                        <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-xs px-1.5 py-0.5 rounded-full font-bold text-white shadow-lg">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {isCollapsed && item.badge && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-lg"></div>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Favorites */}
          {!isCollapsed && favorites.length > 0 && (
            <div className="p-3 border-t border-white/10">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold px-2">FAVORITES</p>
              <div className="space-y-1">
                {favorites.slice(0, 2).map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handlePageChange(item.label)}
                    className="w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-300 group"
                  >
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color} shadow-lg`} />
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className={`${isCollapsed ? 'p-2' : 'p-3'} border-t border-white/10 flex-shrink-0`}>
          <div className="space-y-1 mb-3">
            {bottomItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handlePageChange(item.label)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'space-x-2.5 px-2.5 py-2'} rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-300 group`}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
              </button>
            ))}
          </div>

          {/* User Profile */}
          {!isCollapsed && (
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/10">
              <button 
                onClick={() => handlePageChange('Profile')}
                className="w-full flex items-center space-x-2 hover:bg-white/5 rounded-lg p-1.5 transition-all duration-300 group"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face"
                  alt="Sophia Williams"
                  className="w-7 h-7 rounded-full ring-2 ring-purple-500/30 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs text-white group-hover:text-purple-300 transition-colors truncate">Sophia Williams</p>
                  <p className="text-xs text-gray-400 truncate">sophia@alignul.com</p>
                </div>
                <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center shadow-lg">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </button>
            </div>
          )}
          
          {isCollapsed && (
            <button 
              onClick={() => handlePageChange('Profile')}
              className="w-full flex justify-center p-2.5 rounded-lg hover:bg-white/5 transition-all duration-300"
              title="Profile"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face"
                alt="Sophia Williams"
                className="w-6 h-6 rounded-full ring-2 ring-purple-500/30 object-cover"
              />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-full bg-gray-900/98 backdrop-blur-xl text-white transform transition-transform duration-300 ease-in-out ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="p-4 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Depity</h1>
                  <p className="text-xs text-purple-400 font-medium">HR Management</p>
                </div>
              </div>
              <button 
                onClick={onMobileMenuClose}
                className="p-2 rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-4 font-semibold">WORKSPACE</p>
              
              <nav className="space-y-2">
                {mainNavItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handlePageChange(item.label)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-300 ${
                      currentPage === item.label
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/25'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 transition-colors ${
                      currentPage === item.label ? 'text-white' : 'text-gray-500'
                    }`} />
                    <span className="flex-1 text-left font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-xs px-2 py-0.5 rounded-full font-bold text-white shadow-lg">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Mobile Favorites */}
            {favorites.length > 0 && (
              <div className="p-4 border-t border-white/10">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-4 font-semibold">FAVORITES</p>
                <div className="space-y-2">
                  {favorites.slice(0, 3).map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handlePageChange(item.label)}
                      className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-300"
                    >
                      <div className={`w-3 h-3 rounded-full ${item.color} shadow-lg`} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Bottom Section */}
          <div className="p-4 border-t border-white/10 flex-shrink-0">
            <div className="space-y-2 mb-4">
              {bottomItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handlePageChange(item.label)}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-300"
                >
                  <item.icon className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile User Profile */}
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <button 
                onClick={() => handlePageChange('Profile')}
                className="w-full flex items-center space-x-3 hover:bg-white/5 rounded-xl p-2 transition-all duration-300"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face"
                  alt="Sophia Williams"
                  className="w-10 h-10 rounded-full ring-2 ring-purple-500/30 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-white">Sophia Williams</p>
                  <p className="text-xs text-gray-400 truncate">sophia@alignul.com</p>
                </div>
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;