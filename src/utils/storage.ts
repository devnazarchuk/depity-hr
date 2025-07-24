// Storage utility functions for localStorage management
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  department: string;
  role: 'employee' | 'manager' | 'hr';
  joinDate: string;
  socials: {
    slack?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface TimeOffRequest {
  id: string;
  userId: string;
  date: string;
  type: 'sick' | 'vacation' | 'personal' | 'bereavement';
  status: 'pending' | 'confirmed' | 'rejected';
  reason?: string;
  days: number;
  createdAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  attendeeId: string;
  attendeeName: string;
  attendeeAvatar: string;
  date: string;
  time: string;
  duration: number; // in minutes
  platform: 'google-meet' | 'zoom' | 'teams' | 'in-person';
  department: string;
  description?: string;
  meetingLink?: string;
  type: 'meeting' | 'event';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  tags: string[];
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface UserStatus {
  userId: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: string;
  awayDuration?: number; // in minutes
  awayReason?: string;
}

export interface Settings {
  theme: 'dark' | 'light';
  notifications: {
    email: boolean;
    push: boolean;
    meetings: boolean;
    timeOff: boolean;
    tasks: boolean;
  };
  language: string;
  timezone: string;
}

// Storage keys
const STORAGE_KEYS = {
  CURRENT_USER: 'depity_current_user',
  USERS: 'depity_users',
  TIME_OFF_REQUESTS: 'depity_time_off_requests',
  MEETINGS: 'depity_meetings',
  TASKS: 'depity_tasks',
  USER_STATUSES: 'depity_user_statuses',
  SETTINGS: 'depity_settings',
} as const;

// Generic storage functions
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const setToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
};

export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error);
  }
};

// Specific data access functions
export const getCurrentUser = (): User | null => {
  return getFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null);
};

export const setCurrentUser = (user: User): void => {
  setToStorage(STORAGE_KEYS.CURRENT_USER, user);
};

export const getUsers = (): User[] => {
  return getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
};

export const setUsers = (users: User[]): void => {
  setToStorage(STORAGE_KEYS.USERS, users);
};

export const getTimeOffRequests = (): TimeOffRequest[] => {
  return getFromStorage<TimeOffRequest[]>(STORAGE_KEYS.TIME_OFF_REQUESTS, []);
};

export const setTimeOffRequests = (requests: TimeOffRequest[]): void => {
  setToStorage(STORAGE_KEYS.TIME_OFF_REQUESTS, requests);
};

export const getMeetings = (): Meeting[] => {
  return getFromStorage<Meeting[]>(STORAGE_KEYS.MEETINGS, []);
};

export const setMeetings = (meetings: Meeting[]): void => {
  setToStorage(STORAGE_KEYS.MEETINGS, meetings);
};

export const getTasks = (): Task[] => {
  return getFromStorage<Task[]>(STORAGE_KEYS.TASKS, []);
};

export const setTasks = (tasks: Task[]): void => {
  setToStorage(STORAGE_KEYS.TASKS, tasks);
};

export const getUserStatuses = (): UserStatus[] => {
  return getFromStorage<UserStatus[]>(STORAGE_KEYS.USER_STATUSES, []);
};

export const setUserStatuses = (statuses: UserStatus[]): void => {
  setToStorage(STORAGE_KEYS.USER_STATUSES, statuses);
};

export const getSettings = (): Settings => {
  return getFromStorage<Settings>(STORAGE_KEYS.SETTINGS, {
    theme: 'dark',
    notifications: {
      email: true,
      push: true,
      meetings: true,
      timeOff: true,
      tasks: true,
    },
    language: 'en',
    timezone: 'UTC',
  });
};

export const setSettings = (settings: Settings): void => {
  setToStorage(STORAGE_KEYS.SETTINGS, settings);
};

// Utility functions for data manipulation
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateTime = (date: Date): string => {
  return date.toISOString();
};

export const calculateTimeOffUsed = (userId: string): { used: number; total: number } => {
  const requests = getTimeOffRequests();
  const userRequests = requests.filter(
    req => req.userId === userId && req.status === 'confirmed'
  );
  
  const used = userRequests.reduce((total, req) => total + req.days, 0);
  const total = 20; // Default annual leave days
  
  return { used, total };
};

export const getUserById = (userId: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.id === userId);
};

export const updateUser = (userId: string, updates: Partial<User>): void => {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updates };
    setUsers(users);
    
    // Update current user if it's the same user
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      setCurrentUser({ ...currentUser, ...updates });
    }
  }
};