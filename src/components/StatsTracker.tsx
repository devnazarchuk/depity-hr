import React from 'react';
import { Users, Clock, Wifi, WifiOff } from 'lucide-react';
import { useUserStatuses } from '../hooks/useUserStatuses';

const StatsTracker: React.FC = () => {
  const { 
    loading, 
    getAwayUsers, 
    getOfflineUsers, 
    getOnlineUsers,
    formatAwayDuration, 
    getStatusColor,
    updateUserStatus 
  } = useUserStatuses();

  const awayUsers = getAwayUsers();
  const offlineUsers = getOfflineUsers();
  const onlineUsers = getOnlineUsers();

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 text-white border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-purple-500/20 rounded-xl">
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Stats Tracker</h2>
        </div>
        <button className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium">
          See All
        </button>
      </div>

      {/* Online Users */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-1.5 bg-green-500/20 rounded-lg">
            <Wifi className="w-4 h-4 text-green-500" />
          </div>
          <h3 className="text-sm font-semibold text-gray-300">Online ({onlineUsers.length})</h3>
        </div>
        <div className="space-y-4">
          {onlineUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="p-3 bg-gray-700/50 rounded-xl w-fit mx-auto mb-3">
                <Wifi className="w-8 h-8 mx-auto opacity-50" />
              </div>
              <p className="text-sm font-medium">No users currently online</p>
            </div>
          ) : (
            onlineUsers.map((userStatus) => (
              <div key={userStatus.userId} className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/5 hover:bg-white/10 transition-all duration-300 group">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={userStatus.user?.avatar}
                      alt={userStatus.user?.name}
                      className="w-12 h-12 rounded-full ring-2 ring-green-500/30 object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(userStatus.status)} rounded-full border-2 border-gray-800 shadow-lg`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white break-words">{userStatus.user?.name}</p>
                    <p className="text-xs text-gray-400 font-medium">{userStatus.user?.department}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-400 font-semibold">Active</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Offline Users */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-1.5 bg-gray-500/20 rounded-lg">
            <WifiOff className="w-4 h-4 text-gray-500" />
          </div>
          <h3 className="text-sm font-semibold text-gray-300">Offline ({offlineUsers.length})</h3>
        </div>
        <div className="space-y-4">
          {offlineUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="p-3 bg-gray-700/50 rounded-xl w-fit mx-auto mb-3">
                <WifiOff className="w-8 h-8 mx-auto opacity-50" />
              </div>
              <p className="text-sm font-medium">All users are online</p>
            </div>
          ) : (
            offlineUsers.map((userStatus) => (
              <div key={userStatus.userId} className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/5 hover:bg-white/10 transition-all duration-300 group opacity-75">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={userStatus.user?.avatar}
                      alt={userStatus.user?.name}
                      className="w-12 h-12 rounded-full grayscale ring-2 ring-gray-500/30 object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(userStatus.status)} rounded-full border-2 border-gray-800 shadow-lg`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white break-words">{userStatus.user?.name}</p>
                    <p className="text-xs text-gray-400 font-medium">
                      Last seen {new Date(userStatus.lastSeen).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full" />
                  <span className="text-sm text-gray-500 font-semibold">Offline</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Away List */}
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-1.5 bg-amber-500/20 rounded-lg">
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <h3 className="text-sm font-semibold text-gray-300">Away ({awayUsers.length})</h3>
        </div>
        <div className="space-y-4">
          {awayUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="p-3 bg-gray-700/50 rounded-xl w-fit mx-auto mb-3">
                <Clock className="w-8 h-8 mx-auto opacity-50" />
              </div>
              <p className="text-sm font-medium">No users currently away</p>
            </div>
          ) : (
            awayUsers.map((userStatus) => (
              <div key={userStatus.userId} className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/5 hover:bg-white/10 transition-all duration-300 group">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={userStatus.user?.avatar}
                      alt={userStatus.user?.name}
                      className="w-12 h-12 rounded-full ring-2 ring-amber-500/30 object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center border-2 border-gray-800 shadow-lg">
                      <Clock className="w-2.5 h-2.5 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white break-words">{userStatus.user?.name}</p>
                    <p className="text-xs text-gray-400 font-medium">{userStatus.awayReason || 'Away'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                  <span className="text-sm text-amber-400 font-semibold bg-amber-500/20 px-3 py-1 rounded-xl">
                    {formatAwayDuration(userStatus.awayDuration || 0)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsTracker;