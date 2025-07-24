import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Search, 
  Filter,
  Clock,
  Users,
  Video,
  Building,
  Edit,
  Trash2,
  Eye,
  MapPin
} from 'lucide-react';
import { Meeting } from '../../types/meeting';
import { useMeetings } from '../../hooks/useMeetings';
import MeetingModal from '../modals/MeetingModal';

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | undefined>();
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  const { meetings, addMeeting, removeMeeting, editMeeting, getMeetingsForDate } = useMeetings();

  // Helper function to format date as YYYY-MM-DD without timezone issues
  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get current month/year info
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const today = new Date();
  const todayStr = formatDateString(today);

  // Calendar navigation
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const navigateToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(todayStr);
  };

  // Get calendar days for current month
  const getCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);
    
    // Adjust to show full weeks
    startDate.setDate(startDate.getDate() - startDate.getDay());
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    const days = [];
    const currentDay = new Date(startDate);
    
    while (currentDay <= endDate) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  // Filter meetings
  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = searchQuery === '' || 
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.participants.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDepartment = departmentFilter === '' || meeting.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  // Get meetings for selected date
  const selectedDateMeetings = selectedDate ? getMeetingsForDate(selectedDate) : [];

  const calendarDays = getCalendarDays();

  const getDepartmentColor = (dept: string) => {
    switch (dept) {
      case 'Marketing': return 'bg-orange-500';
      case 'Product': return 'bg-purple-500';
      case 'Engineering': return 'bg-blue-500';
      case 'HR': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Google Meet': return '📹';
      case 'Zoom': return '💻';
      case 'Internal': return '🏢';
      default: return '📞';
    }
  };

  const formatTime = (time: string) => {
    if (!time || typeof time !== 'string' || !time.includes(':')) {
      return 'N/A';
    }
    
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handleCreateMeeting = () => {
    setEditingMeeting(undefined);
    setIsModalOpen(true);
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setIsModalOpen(true);
  };

  const handleDeleteMeeting = (meetingId: string) => {
    if (confirm('Are you sure you want to delete this meeting?')) {
      removeMeeting(meetingId);
    }
  };

  const handleMeetingSubmit = (meeting: Meeting) => {
    if (editingMeeting) {
      editMeeting(meeting.id, meeting);
    } else {
      addMeeting(meeting);
    }
  };

  const handleDayClick = (day: Date) => {
    const dayStr = formatDateString(day);
    setSelectedDate(dayStr);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20 p-4 sm:p-6 lg:p-8 bg-fixed">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl backdrop-blur-sm border border-purple-500/20">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Calendar
                </h1>
                <p className="text-sm sm:text-base text-gray-400 font-medium">Manage your meetings and events</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={navigateToToday}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 border border-white/10 hover:border-white/20 text-sm sm:text-base"
              >
                Today
              </button>
              <button 
                onClick={handleCreateMeeting}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center space-x-2 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">New Meeting</span>
                <span className="sm:hidden">New</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 sm:left-4 top-3 sm:top-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search meetings..."
                className="w-full bg-white/5 backdrop-blur-sm rounded-xl pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 focus:border-purple-500/50 transition-all duration-300"
              />
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-2 bg-white/5 rounded-xl">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="bg-white/5 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 focus:border-purple-500/50 transition-all duration-300"
              >
                <option value="">All Departments</option>
                <option value="Marketing">Marketing</option>
                <option value="Product">Product</option>
                <option value="Engineering">Engineering</option>
                <option value="HR">HR</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
          {/* Calendar Grid */}
          <div className="xl:col-span-3 order-2 xl:order-1">
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 shadow-2xl">
              {/* Calendar Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <button 
                    onClick={() => navigateMonth('prev')}
                    className="p-2 sm:p-3 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-white transition-colors" />
                  </button>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{formatMonthYear(currentDate)}</h2>
                  <button 
                    onClick={() => navigateMonth('next')}
                    className="p-2 sm:p-3 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-white transition-colors" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-1 sm:space-x-2 bg-white/5 rounded-xl p-1">
                  {(['month', 'week', 'day'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 capitalize ${
                        viewMode === mode
                          ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calendar Days Header */}
              <div className="grid grid-cols-7 gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-xs sm:text-sm text-gray-500 p-2 sm:p-3 font-semibold">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 sm:gap-3 lg:gap-4">
                {calendarDays.map((day, index) => {
                  const dayStr = formatDateString(day);
                  const isToday = dayStr === todayStr;
                  const isSelected = dayStr === selectedDate;
                  const isCurrentMonth = day.getMonth() === currentMonth;
                  const dayMeetings = getMeetingsForDate(dayStr);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleDayClick(day)}
                      className={`relative p-2 sm:p-3 lg:p-4 rounded-xl transition-all duration-300 min-h-[60px] sm:min-h-[70px] lg:min-h-[80px] flex flex-col ${
                        isSelected
                          ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/25' 
                          : isToday
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : isCurrentMonth
                          ? 'hover:bg-white/10 text-gray-300 hover:text-white'
                          : 'text-gray-600 hover:bg-white/5'
                      }`}
                    >
                      <span className="text-sm sm:text-base lg:text-lg font-semibold mb-1 sm:mb-2">{day.getDate()}</span>
                      
                      {/* Meeting indicators */}
                      {dayMeetings.length > 0 && (
                        <div className="flex flex-wrap gap-0.5 sm:gap-1 mt-auto">
                          {dayMeetings.slice(0, 3).map((meeting, idx) => (
                            <div
                              key={idx}
                              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getDepartmentColor(meeting.department)} shadow-lg`}
                              title={meeting.title}
                            />
                          ))}
                          {dayMeetings.length > 3 && (
                            <div className="text-xs text-gray-400 font-semibold hidden sm:block">
                              +{dayMeetings.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-4 sm:space-y-6 order-1 xl:order-2">
            {/* Selected Date Info */}
            {selectedDate && (
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">
                  {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                
                <div className="space-y-3 sm:space-y-4">
                  {selectedDateMeetings.length === 0 ? (
                    <div className="text-center py-6 sm:py-8 text-gray-400">
                      <div className="p-4 bg-gray-700/50 rounded-2xl w-fit mx-auto mb-4">
                        <Calendar className="w-6 h-6 sm:w-8 sm:h-8 mx-auto opacity-50" />
                      </div>
                      <p className="font-medium mb-2 text-sm sm:text-base">No meetings scheduled</p>
                      <button 
                        onClick={handleCreateMeeting}
                        className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm font-medium"
                      >
                        Schedule a meeting
                      </button>
                    </div>
                  ) : (
                    selectedDateMeetings.map((meeting) => (
                      <div key={meeting.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-all duration-300 group border border-white/5 hover:border-white/10">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-white text-xs sm:text-sm break-words">{meeting.title}</h4>
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <button
                              onClick={() => handleEditMeeting(meeting)}
                              className="p-1 sm:p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-300"
                              title="Edit meeting"
                            >
                              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMeeting(meeting.id)}
                              className="p-1 sm:p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all duration-300"
                              title="Delete meeting"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-1.5 sm:space-y-2 text-xs">
                          <div className="flex items-center space-x-2 text-gray-400">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-white font-semibold text-xs ${getDepartmentColor(meeting.department)}`}>
                              {meeting.department}
                            </span>
                            <span className="text-gray-400 flex items-center space-x-1 text-xs">
                              <span>{getPlatformIcon(meeting.platform)}</span>
                              <span>{meeting.platform}</span>
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-gray-400">
                            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{(meeting.participants || []).length} participants</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
              <h3 className="text-base sm:text-lg font-bold text-white mb-4">This Month</h3>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-medium text-sm sm:text-base">Total Meetings</span>
                  <span className="text-xl sm:text-2xl font-bold text-white">{filteredMeetings.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-medium text-sm sm:text-base">This Week</span>
                  <span className="text-lg sm:text-xl font-semibold text-purple-400">
                    {filteredMeetings.filter(m => {
                      const meetingDate = new Date(m.date);
                      const weekStart = new Date(today);
                      weekStart.setDate(today.getDate() - today.getDay());
                      const weekEnd = new Date(weekStart);
                      weekEnd.setDate(weekStart.getDate() + 6);
                      return meetingDate >= weekStart && meetingDate <= weekEnd;
                    }).length}
                  </span>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <div className="space-y-1.5 sm:space-y-2">
                    {['Marketing', 'Product', 'Engineering', 'HR'].map(dept => {
                      const count = filteredMeetings.filter(m => m.department === dept).length;
                      return (
                        <div key={dept} className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5 sm:space-x-2">
                            <div className={`w-3 h-3 rounded-full ${getDepartmentColor(dept)}`} />
                            <span className="text-xs sm:text-sm text-gray-400">{dept}</span>
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-white">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meeting Modal */}
      <MeetingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        meeting={editingMeeting}
        onSubmit={handleMeetingSubmit}
        selectedDate={selectedDate || undefined}
      />
    </div>
  );
};

export default CalendarPage;