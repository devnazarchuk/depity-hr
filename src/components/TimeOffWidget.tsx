import React, { useState, useEffect } from 'react';
import { Clock, ChevronRight, Plus } from 'lucide-react';
import Modal from './modals/Modal';
import TimeOffForm from './forms/TimeOffForm';
import { 
  TimeOffRequest, 
  getCurrentUser, 
  getTimeOffRequests, 
  calculateTimeOffUsed 
} from '../utils/storage';

const TimeOffWidget: React.FC = () => {
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usedDays, setUsedDays] = useState(0);
  const [totalDays, setTotalDays] = useState(20);

  useEffect(() => {
    loadTimeOffData();
  }, []);

  const loadTimeOffData = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const allRequests = getTimeOffRequests();
    const userRequests = allRequests
      .filter(req => req.userId === currentUser.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3); // Show only latest 3

    setTimeOffRequests(userRequests);

    const { used, total } = calculateTimeOffUsed(currentUser.id);
    setUsedDays(used);
    setTotalDays(total);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-amber-500';
      case 'confirmed': return 'text-green-500';
      case 'rejected': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '🟡';
      case 'confirmed': return '🟢';
      case 'rejected': return '🔴';
      default: return '⚪';
    }
  };

  const handleNewRequest = (request: TimeOffRequest) => {
    setIsModalOpen(false);
    loadTimeOffData(); // Refresh data
  };

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const percentage = (usedDays / totalDays) * 100;

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 text-white border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-purple-500/20 rounded-xl">
            <Clock className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Time Off</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Request</span>
          </button>
          <button className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium">
            See All
          </button>
        </div>
      </div>

      {/* Progress Circle */}
      <div className="flex items-center justify-center mb-8">
        <div className="relative w-40 h-40">
          <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#1f2937"
              strokeWidth="2"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              strokeDasharray={`${percentage}, 100`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-in-out drop-shadow-lg"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{usedDays}</div>
              <div className="text-xs text-gray-400 font-medium tracking-wider">OUT OF {totalDays}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Off Entries */}
      <div className="space-y-4">
        {timeOffRequests.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="p-4 bg-gray-700/50 rounded-2xl w-fit mx-auto mb-4">
              <Clock className="w-12 h-12 mx-auto opacity-50" />
            </div>
            <p className="font-medium mb-2">No time off requests yet</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium"
            >
              Create your first request
            </button>
          </div>
        ) : (
          timeOffRequests.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-2xl hover:bg-white/10 transition-all duration-300 cursor-pointer border border-white/5 hover:border-white/10 group">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-700/50 rounded-xl group-hover:bg-gray-600/50 transition-colors">
                  <span className="text-lg">{getStatusIcon(entry.status)}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white break-words">{formatDisplayDate(entry.date)}</p>
                  <p className="text-xs text-gray-400">
                    <span className="font-medium break-words">({capitalizeFirst(entry.type)})</span> - {entry.days} day{entry.days > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-semibold capitalize px-3 py-1 rounded-full ${
                  entry.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                  entry.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {entry.status}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-400 transition-colors" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Time Off Request Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Request Time Off"
        size="md"
      >
        <TimeOffForm
          onSubmit={handleNewRequest}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default TimeOffWidget;