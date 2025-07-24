import { useState, useEffect } from 'react';
import { 
  UserStatus, 
  User,
  getUserStatuses, 
  setUserStatuses, 
  getUsers,
  formatDateTime 
} from '../utils/storage';

export const useUserStatuses = () => {
  const [userStatuses, setUserStatusesState] = useState<UserStatus[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = () => {
      const statuses = getUserStatuses();
      const allUsers = getUsers();
      setUserStatusesState(statuses);
      setUsers(allUsers);
      setLoading(false);
    };

    loadData();
  }, []);

  // Real-time simulation for away users
  useEffect(() => {
    const interval = setInterval(() => {
      setUserStatusesState(prevStatuses => {
        const updatedStatuses = prevStatuses.map(status => {
          if (status.status === 'away') {
            const lastSeenTime = new Date(status.lastSeen).getTime();
            const now = Date.now();
            const newAwayDuration = Math.floor((now - lastSeenTime) / (1000 * 60)); // in minutes
            
            return {
              ...status,
              awayDuration: newAwayDuration
            };
          }
          return status;
        });

        // Save updated statuses to localStorage
        setUserStatuses(updatedStatuses);
        return updatedStatuses;
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const updateUserStatus = (userId: string, newStatus: UserStatus['status'], awayReason?: string) => {
    const updatedStatuses = userStatuses.map(status => {
      if (status.userId === userId) {
        const now = formatDateTime(new Date());
        return {
          ...status,
          status: newStatus,
          lastSeen: now,
          awayDuration: newStatus === 'away' ? 0 : undefined,
          awayReason: newStatus === 'away' ? awayReason : undefined
        };
      }
      return status;
    });

    setUserStatuses(updatedStatuses);
    setUserStatusesState(updatedStatuses);
  };

  const getUserById = (userId: string): User | undefined => {
    return users.find(user => user.id === userId);
  };

  const getAwayUsers = (): Array<UserStatus & { user?: User }> => {
    return userStatuses
      .filter(status => status.status === 'away')
      .map(status => ({
        ...status,
        user: getUserById(status.userId)
      }))
      .filter(item => item.user); // Only include users that exist
  };

  const getOfflineUsers = (): Array<UserStatus & { user?: User }> => {
    return userStatuses
      .filter(status => status.status === 'offline')
      .map(status => ({
        ...status,
        user: getUserById(status.userId)
      }))
      .filter(item => item.user);
  };

  const getOnlineUsers = (): Array<UserStatus & { user?: User }> => {
    return userStatuses
      .filter(status => status.status === 'online')
      .map(status => ({
        ...status,
        user: getUserById(status.userId)
      }))
      .filter(item => item.user);
  };

  const formatAwayDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${remainingMinutes}m`;
  };

  const getStatusColor = (status: UserStatus['status']): string => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-amber-500';
      case 'busy': return 'bg-red-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return {
    userStatuses,
    users,
    loading,
    updateUserStatus,
    getUserById,
    getAwayUsers,
    getOfflineUsers,
    getOnlineUsers,
    formatAwayDuration,
    getStatusColor
  };
};