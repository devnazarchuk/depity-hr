import React, { useState, useEffect } from 'react';
import { Clock, Plus, Search, Filter, Calendar, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { TimeOffRequest, getCurrentUser, getTimeOffRequests, calculateTimeOffUsed } from '../../utils/storage';
import Modal from '../modals/Modal';
import TimeOffForm from '../forms/TimeOffForm';

const TimeOffPage: React.FC = () => {
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
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
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setTimeOffRequests(userRequests);

    const { used, total } = calculateTimeOffUsed(currentUser.id);
    setUsedDays(used);
    setTotalDays(total);
  };

  const filteredRequests = timeOffRequests.filter(request => {
    const matchesSearch = searchQuery === '' || 
      request.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === '' || request.status === statusFilter;
    const matchesType = typeFilter === '' || request.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'confirmed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleNewRequest = (request: TimeOffRequest) => {
    setIsModalOpen(false);
    loadTimeOffData();
  };

  const percentage = (usedDays / totalDays) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20 p-4 sm:p-6 lg:p-8 bg-fixed">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl backdrop-blur-sm border border-purple-500/20">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Time Off
                </h1>
                <p className="text-sm sm:text-base text-gray-400 font-medium">Manage your time off requests and balance</p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center space-x-2 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">New Request</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>

          {/* Balance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 lg:mb-8">
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
                <h3 className="text-base sm:text-lg font-bold text-white mb-4">Annual Balance</h3>
                <div className="flex items-center justify-center mb-4 sm:mb-6">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32">
                    <svg className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 transform -rotate-90" viewBox="0 0 36 36">
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
                        <div className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{usedDays}</div>
                        <div className="text-xs text-gray-400 font-medium tracking-wider">OUT OF {totalDays}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm sm:text-base">Used</span>
                    <span className="text-white font-semibold text-sm sm:text-base">{usedDays} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm sm:text-base">Remaining</span>
                    <span className="text-green-400 font-semibold text-sm sm:text-base">{totalDays - usedDays} days</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
                <h3 className="text-base sm:text-lg font-bold text-white mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="text-center">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-400">{filteredRequests.filter(r => r.status === 'pending').length}</div>
                    <div className="text-xs sm:text-sm text-gray-400">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-400">{filteredRequests.filter(r => r.status === 'confirmed').length}</div>
                    <div className="text-xs sm:text-sm text-gray-400">Approved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-400">{filteredRequests.filter(r => r.status === 'rejected').length}</div>
                    <div className="text-xs sm:text-sm text-gray-400">Rejected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-400">{filteredRequests.length}</div>
                    <div className="text-xs sm:text-sm text-gray-400">Total</div>
                  </div>
                </div>
              </div>
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
                placeholder="Search requests..."
                className="w-full bg-white/5 backdrop-blur-sm rounded-xl pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 focus:border-purple-500/50 transition-all duration-300"
              />
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-2 bg-white/5 rounded-xl">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white/5 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 focus:border-purple-500/50 transition-all duration-300"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-white/5 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 focus:border-purple-500/50 transition-all duration-300"
              >
                <option value="">All Types</option>
                <option value="vacation">Vacation</option>
                <option value="sick">Sick Leave</option>
                <option value="personal">Personal</option>
                <option value="bereavement">Bereavement</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 shadow-2xl">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Time Off Requests</h2>
          
          <div className="space-y-3 sm:space-y-4">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-8 sm:py-12 text-gray-400">
                <div className="p-4 bg-gray-700/50 rounded-2xl w-fit mx-auto mb-4">
                  <Clock className="w-8 h-8 sm:w-12 sm:h-12 mx-auto opacity-50" />
                </div>
                <p className="font-medium mb-2 text-sm sm:text-base">No time off requests found</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm font-medium"
                >
                  Create your first request
                </button>
              </div>
            ) : (
              filteredRequests.map((request) => (
                <div key={request.id} className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-white/10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                        <div className="p-2 bg-gray-700/50 rounded-xl">
                          {getStatusIcon(request.status)}
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-white break-words">{formatDisplayDate(request.date)}</h3>
                          <p className="text-xs sm:text-sm text-gray-400">
                            {capitalizeFirst(request.type)} - {request.days} day{request.days > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      
                      {request.reason && (
                        <div className="mb-3 sm:mb-4">
                          <p className="text-gray-300 bg-gray-700/30 p-2.5 sm:p-3 rounded-xl text-sm sm:text-base break-words">{request.reason}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-400">
                        <div className="flex items-center space-x-1.5 sm:space-x-2">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Requested on {new Date(request.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <span className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold border ${getStatusColor(request.status)}`}>
                        {capitalizeFirst(request.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
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

export default TimeOffPage;