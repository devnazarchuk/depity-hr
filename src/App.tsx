import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CalendarPage from './components/pages/CalendarPage';
import TimeOffPage from './components/pages/TimeOffPage';
import ProjectsPage from './components/pages/ProjectsPage';
import TeamPage from './components/pages/TeamPage';
import NotesPage from './components/pages/NotesPage';
import BenefitsPage from './components/pages/BenefitsPage';
import DocumentsPage from './components/pages/DocumentsPage';
import SettingsPage from './components/pages/SettingsPage';
import SupportPage from './components/pages/SupportPage';
import ProfilePage from './components/pages/ProfilePage';
import { initializeMockData } from './utils/mockData';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('Dashboard');

  useEffect(() => {
    // Initialize mock data on app start
    initializeMockData();
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'Calendar':
        return <CalendarPage />;
      case 'Time Off':
        return <TimeOffPage />;
      case 'Projects':
        return <ProjectsPage />;
      case 'Team':
        return <TeamPage />;
      case 'Notes':
        return <NotesPage />;
      case 'Benefits':
        return <BenefitsPage />;
      case 'Documents':
        return <DocumentsPage />;
      case 'Settings':
        return <SettingsPage />;
      case 'Support':
        return <SupportPage />;
      case 'Profile':
        return <ProfilePage />;
      case 'Dashboard':
      default:
        return <Dashboard />;
    }
  };

  const handleHeaderProfileClick = () => {
    setCurrentPage('Profile');
    setMobileMenuOpen(false);
  };

  const handleHeaderSearchClick = () => {
    // Could implement a global search modal here
    console.log('Global search opened');
  };

  const handleHeaderNotificationsClick = () => {
    // Could implement a notifications panel here
    console.log('Notifications panel opened');
  };

  const handleHeaderSettingsClick = () => {
    setCurrentPage('Settings');
    setMobileMenuOpen(false);
  };

  const handleHeaderScheduleClick = () => {
    setCurrentPage('Calendar');
    setMobileMenuOpen(false);
  };

  const handleHeaderNewClick = () => {
    // Could implement a "new item" modal here
    console.log('New item modal opened');
  };
  
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20 relative">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 group"
      >
        <div className="relative p-3 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl border border-white/10 text-white hover:bg-gradient-to-br hover:from-gray-700/90 hover:to-gray-800/90 transition-all duration-300 shadow-lg hover:shadow-xl">
          <Menu className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-purple-500/30 to-purple-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10"></div>
        </div>
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuClose={() => setMobileMenuOpen(false)}
      />
      
      {/* Main Content */}
      <div className={`flex-1 min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-56'}`}>
        {currentPage === 'Dashboard' ? (
          <Dashboard 
            onProfileClick={handleHeaderProfileClick}
            onSearchClick={handleHeaderSearchClick}
            onNotificationsClick={handleHeaderNotificationsClick}
            onSettingsClick={handleHeaderSettingsClick}
            onScheduleClick={handleHeaderScheduleClick}
            onNewClick={handleHeaderNewClick}
          />
        ) : (
          renderCurrentPage()
        )}
      </div>
    </div>
  );
}

export default App;