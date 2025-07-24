import React, { useState, useEffect } from 'react';
import { Calendar, Search, ChevronLeft, ChevronRight, Plus, Edit, Trash2 } from 'lucide-react';
import { Meeting } from '../types/meeting';
import { useMeetings } from '../hooks/useMeetings';
import MeetingModal from './modals/MeetingModal';

  // Helper function to format date as YYYY-MM-DD without timezone issues
  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

const ScheduleWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'meetings' | 'events'>('meetings');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(formatDateString(new Date()));
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | undefined>();
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  
  const { meetings, addMeeting, removeMeeting, editMeeting, getMeetingsForDate } = useMeetings();

  // Get meetings for selected date
  const dayMeetings = getMeetingsForDate(selectedDate);
  
  // Filter meetings based on search and department
  const filteredMeetings = dayMeetings.filter(meeting => {
    const matchesSearch = searchQuery === '' || 
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.participants.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDepartment = departmentFilter === '' || meeting.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

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

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(i);
    }
    return days;
  };

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(date.getDate() - day);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      weekDays.push(currentDay);
    }
    return weekDays;
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const formatTime = (time: string) => {
    // Check if time is valid before attempting to split
    if (!time || typeof time !== 'string' || !time.includes(':')) {
      return 'N/A';
    }
    
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const weekDays = getWeekDays(currentDate);
  const today = new Date().getDate();
  const todayStr = formatDateString(new Date());

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
    setSelectedDate(formatDateString(day));
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 text-white border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-purple-500/20 rounded-xl">
            <Calendar className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Schedule</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleCreateMeeting}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New</span>
          </button>
          <button className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium">
            See All
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
            className="p-2 rounded-xl hover:bg-white/10 transition-all duration-300 group"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </button>
          <h3 className="font-bold text-lg">{formatMonth(currentDate)}</h3>
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
            className="p-2 rounded-xl hover:bg-white/10 transition-all duration-300 group"
          >
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs text-gray-500 p-2 font-semibold">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => {
            const dayStr = formatDateString(day);
            const isToday = dayStr === todayStr;
            const isSelected = dayStr === selectedDate;
            const dayMeetingCount = getMeetingsForDate(dayStr).length;
            
            return (
              <button
                key={index}
                onClick={() => handleDayClick(day)}
                className={`p-3 text-sm rounded-xl transition-all duration-300 relative font-medium ${
                  isSelected
                    ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/25' 
                    : isToday
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'hover:bg-white/10 text-gray-300 hover:text-white'
                }`}
              >
                {day.getDate().toString().padStart(2, '0')}
                {dayMeetingCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                    {dayMeetingCount}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 absolute left-4 top-3.5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="w-full bg-white/5 backdrop-blur-sm rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 focus:border-purple-500/50 transition-all duration-300"
        />
      </div>

      {/* Department Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setDepartmentFilter('')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
            departmentFilter === '' 
              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg' 
              : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
          }`}
        >
          All
        </button>
        {['Marketing', 'Product', 'Engineering', 'HR'].map(dept => (
          <button
            key={dept}
            onClick={() => setDepartmentFilter(dept)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
              departmentFilter === dept 
                ? `${getDepartmentColor(dept)} text-white shadow-lg` 
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-white/5 backdrop-blur-sm rounded-xl p-1 border border-white/10">
        <button
          onClick={() => setActiveTab('meetings')}
          className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all duration-300 ${
            activeTab === 'meetings'
              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Meetings
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all duration-300 ${
            activeTab === 'events'
              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Events
        </button>
      </div>

      {/* Meetings List */}
      <div className="mb-4">
        <p className="text-sm text-gray-400 font-medium">
          {new Date(selectedDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
          {filteredMeetings.length > 0 && (
            <span className="ml-2">({filteredMeetings.length} meeting{filteredMeetings.length !== 1 ? 's' : ''})</span>
          )}
        </p>
      </div>
      
      <div className="space-y-4">
        {filteredMeetings.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="p-4 bg-gray-700/50 rounded-2xl w-fit mx-auto mb-4">
              <Calendar className="w-12 h-12 mx-auto opacity-50" />
            </div>
            <p className="font-medium mb-2">No meetings scheduled for this day</p>
            <button 
              onClick={handleCreateMeeting}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium"
            >
              Schedule a meeting
            </button>
          </div>
        ) : (
          filteredMeetings.map((meeting) => (
            <div key={meeting.id} className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/10 transition-all duration-300 group border border-white/5 hover:border-white/10">
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-base mb-2 break-words">{meeting.title}</h4>
                    <p className="text-sm text-gray-400 mb-3 font-medium">
                      {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                    </p>
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`text-xs px-3 py-1.5 rounded-xl text-white font-semibold shadow-lg ${getDepartmentColor(meeting.department)}`}>
                        {meeting.department}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center space-x-2 bg-gray-700/50 px-3 py-1.5 rounded-xl">
                        <span>{getPlatformIcon(meeting.platform)}</span>
                        <span className="font-medium">{meeting.platform}</span>
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 bg-gray-700/30 px-3 py-2 rounded-xl">
                      <span className="font-medium break-words">Participants: {(meeting.participants || []).join(', ')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={() => handleEditMeeting(meeting)}
                      className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-300"
                      title="Edit meeting"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMeeting(meeting.id)}
                      className="p-2 rounded-xl hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all duration-300"
                      title="Delete meeting"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {meeting.notes && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-sm text-gray-400 italic">{meeting.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Meeting Modal */}
      <MeetingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        meeting={editingMeeting}
        onSubmit={handleMeetingSubmit}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default ScheduleWidget;