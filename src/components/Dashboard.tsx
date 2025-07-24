import React from 'react';
import TimeOffWidget from './TimeOffWidget';
import ScheduleWidget from './ScheduleWidget';
import StatsTracker from './StatsTracker';
import Stackacker from './Stackacker';
import Header from './Header';

interface DashboardProps {
  onProfileClick?: () => void;
  onSearchClick?: () => void;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
  onScheduleClick?: () => void;
  onNewClick?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  onProfileClick,
  onSearchClick,
  onNotificationsClick,
  onSettingsClick,
  onScheduleClick,
  onNewClick
}) => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20">
      <Header 
        onProfileClick={onProfileClick}
        onSearchClick={onSearchClick}
        onNotificationsClick={onNotificationsClick}
        onSettingsClick={onSettingsClick}
        onScheduleClick={onScheduleClick}
        onNewClick={onNewClick}
      />
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 lg:mb-8">
          <TimeOffWidget />
          <ScheduleWidget />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <StatsTracker />
          <Stackacker />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;