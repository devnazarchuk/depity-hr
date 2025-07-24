// Mock data initialization for localStorage
import { 
  User, 
  TimeOffRequest, 
  Task, 
  UserStatus,
  setUsers,
  setTimeOffRequests,
  setTasks,
  setUserStatuses,
  setCurrentUser,
  getUsers,
  generateId,
  formatDate,
  formatDateTime
} from './storage';

export const initializeMockData = (): void => {
  // Only initialize if no data exists
  if (getUsers().length === 0) {
    initializeUsers();
    initializeTimeOffRequests();
    initializeTasks();
    initializeUserStatuses();
  }
};

const initializeUsers = (): void => {
  const users: User[] = [
    {
      id: 'user-1',
      name: 'Sophia Williams',
      email: 'sophia@alignul.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
      department: 'Product Management',
      role: 'manager',
      joinDate: '2022-01-15',
      socials: {
        slack: '@sophia.williams',
        linkedin: 'sophia-williams-pm',
        github: 'sophiawilliams'
      }
    },
    {
      id: 'user-2',
      name: 'James Brown',
      email: 'james.brown@alignul.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      department: 'Marketing',
      role: 'employee',
      joinDate: '2022-03-20',
      socials: {
        slack: '@james.brown',
        linkedin: 'james-brown-marketing'
      }
    },
    {
      id: 'user-3',
      name: 'Laura Perez',
      email: 'laura.perez@alignul.com',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face',
      department: 'Product Management',
      role: 'employee',
      joinDate: '2022-05-10',
      socials: {
        slack: '@laura.perez',
        linkedin: 'laura-perez-product'
      }
    },
    {
      id: 'user-4',
      name: 'Arthur Taylor',
      email: 'arthur.taylor@alignul.com',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face',
      department: 'Engineering',
      role: 'employee',
      joinDate: '2021-11-05',
      socials: {
        slack: '@arthur.taylor',
        github: 'arthurtaylor'
      }
    },
    {
      id: 'user-5',
      name: 'Emma Wright',
      email: 'emma.wright@alignul.com',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
      department: 'Design',
      role: 'employee',
      joinDate: '2022-07-12',
      socials: {
        slack: '@emma.wright',
        linkedin: 'emma-wright-design'
      }
    }
  ];

  setUsers(users);
  setCurrentUser(users[0]); // Set Sophia as current user
};

const initializeTimeOffRequests = (): void => {
  const requests: TimeOffRequest[] = [
    {
      id: generateId(),
      userId: 'user-1',
      date: '2023-08-11',
      type: 'sick',
      status: 'pending',
      reason: 'Doctor appointment',
      days: 1,
      createdAt: formatDateTime(new Date('2023-08-10'))
    },
    {
      id: generateId(),
      userId: 'user-1',
      date: '2023-07-15',
      type: 'vacation',
      status: 'confirmed',
      reason: 'Summer vacation',
      days: 5,
      createdAt: formatDateTime(new Date('2023-07-01'))
    },
    {
      id: generateId(),
      userId: 'user-1',
      date: '2023-06-24',
      type: 'personal',
      status: 'rejected',
      reason: 'Personal matters',
      days: 2,
      createdAt: formatDateTime(new Date('2023-06-20'))
    },
    {
      id: generateId(),
      userId: 'user-1',
      date: '2023-05-10',
      type: 'vacation',
      status: 'confirmed',
      reason: 'Spring break',
      days: 3,
      createdAt: formatDateTime(new Date('2023-05-01'))
    },
    {
      id: generateId(),
      userId: 'user-1',
      date: '2023-04-20',
      type: 'sick',
      status: 'confirmed',
      reason: 'Flu',
      days: 2,
      createdAt: formatDateTime(new Date('2023-04-19'))
    },
    {
      id: generateId(),
      userId: 'user-1',
      date: '2023-03-15',
      type: 'vacation',
      status: 'confirmed',
      reason: 'Family visit',
      days: 4,
      createdAt: formatDateTime(new Date('2023-03-01'))
    },
    {
      id: generateId(),
      userId: 'user-1',
      date: '2023-02-28',
      type: 'personal',
      status: 'confirmed',
      reason: 'Moving day',
      days: 1,
      createdAt: formatDateTime(new Date('2023-02-25'))
    }
  ];

  setTimeOffRequests(requests);
};

const initializeTasks = (): void => {
  const tasks: Task[] = [
    {
      id: generateId(),
      title: 'Text inputs for Design System',
      description: 'Search for integration to provide a comprehensive input component library',
      dueDate: '2023-08-02',
      completed: false,
      tags: ['Tedio', 'Recoil'],
      assignedTo: 'user-5',
      priority: 'high',
      createdAt: formatDateTime(new Date('2023-07-25'))
    },
    {
      id: generateId(),
      title: 'Check neutral and state colors',
      description: 'Button components will review a lovid color palette for consistency',
      dueDate: '2023-08-09',
      completed: true,
      tags: ['Lingelty', 'Pessinel'],
      assignedTo: 'user-5',
      priority: 'medium',
      createdAt: formatDateTime(new Date('2023-07-20'))
    },
    {
      id: generateId(),
      title: 'Implement user authentication',
      description: 'Set up secure login and registration system with proper validation',
      dueDate: '2023-08-15',
      completed: false,
      tags: ['Auth', 'Security'],
      assignedTo: 'user-4',
      priority: 'high',
      createdAt: formatDateTime(new Date('2023-07-28'))
    },
    {
      id: generateId(),
      title: 'Marketing campaign analysis',
      description: 'Analyze Q2 marketing performance and prepare recommendations',
      dueDate: '2023-08-05',
      completed: false,
      tags: ['Analytics', 'Marketing'],
      assignedTo: 'user-2',
      priority: 'medium',
      createdAt: formatDateTime(new Date('2023-07-30'))
    }
  ];

  setTasks(tasks);
};

const initializeUserStatuses = (): void => {
  const statuses: UserStatus[] = [
    {
      userId: 'user-1',
      status: 'away',
      lastSeen: formatDateTime(new Date(Date.now() - 25 * 60 * 1000)), // 25 minutes ago
      awayDuration: 25,
      awayReason: 'Depity meeting'
    },
    {
      userId: 'user-2',
      status: 'offline',
      lastSeen: formatDateTime(new Date(Date.now() - 2 * 60 * 60 * 1000)), // 2 hours ago
      awayDuration: 0
    },
    {
      userId: 'user-3',
      status: 'online',
      lastSeen: formatDateTime(new Date()),
      awayDuration: 0
    },
    {
      userId: 'user-4',
      status: 'away',
      lastSeen: formatDateTime(new Date(Date.now() - 2 * 60 * 1000)), // 2 minutes ago
      awayDuration: 2,
      awayReason: 'Doc review'
    },
    {
      userId: 'user-5',
      status: 'away',
      lastSeen: formatDateTime(new Date(Date.now() - 5 * 60 * 1000)), // 5 minutes ago
      awayDuration: 5,
      awayReason: 'Pulse check'
    }
  ];

  setUserStatuses(statuses);
};