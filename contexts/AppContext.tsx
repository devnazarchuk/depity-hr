'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'hr' | 'manager' | 'employee';
  status: 'active' | 'inactive' | 'pending';
  department: string;
  joinDate: string;
  avatar: string;
  phone?: string;
  location?: string;
  bio?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  folderId: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  owner: string;
  createdAt: string;
  documentsCount: number;
}

export interface OnboardingTask {
  id: string;
  userId: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  tasks: Array<{
    id: string;
    name: string;
    completed: boolean;
    dueDate?: string;
  }>;
  progress: number;
}

export interface Session {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  lastActivity: number;
  sessionTimeout: number; // в хвилинах
}

export interface SessionSettings {
  sessionTimeout: number; // в хвилинах
  autoRefresh: boolean;
  showSessionTimer: boolean;
}

interface AppContextType {
  users: User[];
  documents: Document[];
  folders: Folder[];
  onboardingTasks: OnboardingTask[];
  currentUser: User | null;
  isAuthenticated: boolean;
  session: Session | null;
  sessionSettings: SessionSettings;
  sessionTimeLeft: number; // в секундах
  isSessionLoading: boolean;
  updateUser: (id: string, updates: Partial<User>) => void;
  updateOnboardingStatus: (id: string, status: OnboardingTask['status']) => void;
  addDocument: (document: Omit<Document, 'id'>) => void;
  deleteDocument: (id: string) => void;
  addFolder: (folder: Omit<Folder, 'id' | 'documentsCount'>) => void;
  deleteFolder: (id: string) => void;
  startOnboarding: (userId: string) => void;
  completeOnboardingTask: (taskId: string, taskItemId: string) => void;
  renameDocument: (id: string, newName: string) => void;
  downloadDocument: (id: string) => void;
  moveDocument: (documentId: string, newFolderId: string) => void;
  moveFolder: (folderId: string, newParentId: string | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  resetData: () => void;
  updateSessionSettings: (settings: Partial<SessionSettings>) => void;
  extendSession: () => void;
  updateActivity: () => void;
  // Role-based data access helpers
  getUsersForRole: () => User[];
  getDocumentsForRole: () => Document[];
  getOnboardingTasksForRole: () => OnboardingTask[];
  canEditUser: (userId: string) => boolean;
  canAccessDocument: (documentId: string) => boolean;
  canAccessOnboarding: (taskId: string) => boolean;
  getDashboardStats: () => any;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'admin',
    status: 'active',
    department: 'HR',
    joinDate: '2023-01-15',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    role: 'manager',
    status: 'active',
    department: 'Engineering',
    joinDate: '2023-02-20',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=150',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    role: 'employee',
    status: 'pending',
    department: 'Marketing',
    joinDate: '2024-01-10',
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?w=150',
    phone: '+1 (555) 345-6789',
    location: 'Austin, TX'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@company.com',
    role: 'employee',
    status: 'active',
    department: 'Sales',
    joinDate: '2023-11-05',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=150',
    phone: '+1 (555) 456-7890',
    location: 'Chicago, IL'
  },
  {
    id: '5',
    name: 'Alex Thompson',
    email: 'alex.thompson@company.com',
    role: 'hr',
    status: 'active',
    department: 'HR',
    joinDate: '2023-03-15',
    avatar: 'https://images.pexels.com/photos/927022/pexels-photo-927022.jpeg?w=150',
    phone: '+1 (555) 567-8901',
    location: 'Boston, MA'
  }
];

const mockFolders: Folder[] = [
  {
    id: '1',
    name: 'HR Documents',
    parentId: null,
    owner: 'Sarah Johnson',
    createdAt: '2024-01-01',
    documentsCount: 5
  },
  {
    id: '2',
    name: 'Employee Contracts',
    parentId: '1',
    owner: 'Sarah Johnson',
    createdAt: '2024-01-02',
    documentsCount: 3
  },
  {
    id: '3',
    name: 'Training Materials',
    parentId: null,
    owner: 'Michael Chen',
    createdAt: '2024-01-03',
    documentsCount: 8
  }
];

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Employee Handbook.pdf',
    type: 'pdf',
    size: 2048000,
    folderId: '1',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: '2024-01-15',
    url: '#'
  },
  {
    id: '2',
    name: 'Contract_Template.docx',
    type: 'docx',
    size: 512000,
    folderId: '2',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: '2024-01-16',
    url: '#'
  }
];

const mockOnboardingTasks: OnboardingTask[] = [
  {
    id: '1',
    userId: '3',
    status: 'in-progress',
    progress: 60,
    tasks: [
      { id: '1', name: 'Complete profile setup', completed: true },
      { id: '2', name: 'Sign employment contract', completed: true },
      { id: '3', name: 'IT equipment setup', completed: true, dueDate: '2024-01-12' },
      { id: '4', name: 'Complete orientation training', completed: false, dueDate: '2024-01-15' },
      { id: '5', name: 'Meet with manager', completed: false, dueDate: '2024-01-18' }
    ]
  },
  {
    id: '2',
    userId: '4',
    status: 'completed',
    progress: 100,
    tasks: [
      { id: '1', name: 'Complete profile setup', completed: true },
      { id: '2', name: 'Sign employment contract', completed: true },
      { id: '3', name: 'IT equipment setup', completed: true },
      { id: '4', name: 'Complete orientation training', completed: true },
      { id: '5', name: 'Meet with manager', completed: true }
    ]
  }
];

// Mock authentication data
const mockCredentials = {
  'sarah.johnson@company.com': { password: 'admin123', role: 'admin' },
  'michael.chen@company.com': { password: 'manager123', role: 'manager' },
  'emily.rodriguez@company.com': { password: 'employee123', role: 'employee' },
  'david.kim@company.com': { password: 'employee123', role: 'employee' },
  'alex.thompson@company.com': { password: 'hr123', role: 'hr' }
};

// Permission matrix - Comprehensive role-based access control
const permissions = {
  // Employee permissions - minimal access
  employee: [
    'dashboard_view', 
    'profile_edit_own', 
    'documents_view_assigned', 
    'documents_download_assigned',
    'documents_view_all', // For navigation
    'onboarding_view_own' // Can view their own onboarding
  ],
  
  // HR permissions - full HR management capabilities
  hr: [
    'dashboard_view', 
    'dashboard_hr_stats', 
    'team_view', 
    'team_view_all',
    'team_edit', 
    'team_add_employee', 
    'documents_view_all', 
    'documents_upload', 
    'documents_delete', 
    'documents_rename', 
    'documents_manage_folders', 
    'onboarding_view_all', 
    'onboarding_manage', 
    'onboarding_add_employee', 
    'profile_edit_all', 
    'settings_view'
  ],
  
  // Manager permissions - team-specific access
  manager: [
    'dashboard_view', 
    'dashboard_manager_stats', 
    'team_view', 
    'team_view_all',
    'team_view_own', 
    'team_edit_own', 
    'documents_view_all',
    'documents_view_team', 
    'documents_upload_team', 
    'documents_delete_team', 
    'documents_rename_team', 
    'onboarding_view_all',
    'onboarding_view_team', 
    'profile_edit_team', 
    'settings_view'
  ],
  
  // Admin permissions - full system access
  admin: [
    'dashboard_view', 
    'dashboard_admin_stats', 
    'team_view', 
    'team_view_all', 
    'team_edit_all', 
    'team_add_employee', 
    'team_delete_employee', 
    'team_manage_roles', 
    'documents_view_all', 
    'documents_upload', 
    'documents_delete', 
    'documents_rename', 
    'documents_manage_folders', 
    'onboarding_view_all', 
    'onboarding_manage', 
    'onboarding_add_employee', 
    'access_control_view', 
    'access_control_manage', 
    'profile_edit_all', 
    'settings_view', 
    'settings_manage'
  ]
};

// JWT utilities
const generateToken = (payload: any, expiresIn: number): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payloadStr = btoa(JSON.stringify({ ...payload, exp: Date.now() + expiresIn }));
  const signature = btoa('mock-signature-' + Date.now());
  return `${header}.${payloadStr}.${signature}`;
};

const decodeToken = (token: string): any => {
  try {
    const [, payload] = token.split('.');
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

const isTokenValid = (token: string): boolean => {
  const decoded = decodeToken(token);
  return decoded && decoded.exp > Date.now();
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem('hr_users');
    return stored ? JSON.parse(stored) : mockUsers;
  });
  const [documents, setDocuments] = useState<Document[]>(() => {
    const stored = localStorage.getItem('hr_documents');
    return stored ? JSON.parse(stored) : mockDocuments;
  });
  const [folders, setFolders] = useState<Folder[]>(() => {
    const stored = localStorage.getItem('hr_folders');
    return stored ? JSON.parse(stored) : mockFolders;
  });
  const [onboardingTasks, setOnboardingTasks] = useState<OnboardingTask[]>(() => {
    const stored = localStorage.getItem('hr_onboarding');
    return stored ? JSON.parse(stored) : mockOnboardingTasks;
  });
  
  const [session, setSession] = useState<Session | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(0);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  const [sessionSettings, setSessionSettings] = useState<SessionSettings>(() => {
    const stored = localStorage.getItem('hr_session_settings');
    return stored ? JSON.parse(stored) : {
      sessionTimeout: 30, // 30 хвилин
      autoRefresh: true,
      showSessionTimer: true
    };
  });

  // Ref to prevent duplicate session restoration in strict mode
  const sessionRestoredRef = useRef(false);

  // Save session settings to localStorage
  useEffect(() => {
    localStorage.setItem('hr_session_settings', JSON.stringify(sessionSettings));
  }, [sessionSettings]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('hr_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('hr_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('hr_folders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem('hr_onboarding', JSON.stringify(onboardingTasks));
  }, [onboardingTasks]);

  // Session management - run only once on mount
  useEffect(() => {
    if (sessionRestoredRef.current) return;
    sessionRestoredRef.current = true;
    
    console.log('🔍 Checking for stored session...');
    // Check for stored session
    const storedSession = localStorage.getItem('hr_session');
    if (storedSession) {
      try {
        const sessionData: Session = JSON.parse(storedSession);
        console.log('📦 Found session data:', sessionData);
        
        const tokenValid = isTokenValid(sessionData.accessToken);
        
        console.log('🔐 Token valid:', tokenValid);
        
        // Check if session is still valid
        if (tokenValid) {
          console.log('✅ Session is valid, restoring...');
          setSession(sessionData);
          setCurrentUser(sessionData.user);
          setIsAuthenticated(true);
        } else {
          console.log('❌ Session expired, clearing...');
          // Session expired, clear it
          localStorage.removeItem('hr_session');
        }
      } catch (error) {
        console.log('❌ Invalid session data, clearing...', error);
        // Invalid session data, clear it
        localStorage.removeItem('hr_session');
      }
    } else {
      console.log('📭 No stored session found');
    }
    setIsSessionLoading(false);
  }, []);

  // Activity tracking
  useEffect(() => {
    if (!isAuthenticated) return;

    const updateActivity = () => {
      if (session) {
        const updatedSession = { ...session, lastActivity: Date.now() };
        setSession(updatedSession);
        localStorage.setItem('hr_session', JSON.stringify(updatedSession));
      }
    };

    // Update activity on user interactions
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [isAuthenticated, session]);

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...updates } : user
    ));
    
    // Update currentUser if it's the same user
    if (currentUser && currentUser.id === id) {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      
      // Update session if exists
      if (session) {
        const updatedSession = { ...session, user: updatedUser };
        setSession(updatedSession);
        localStorage.setItem('hr_session', JSON.stringify(updatedSession));
      }
    }
  };

  const updateOnboardingStatus = (id: string, status: OnboardingTask['status']) => {
    setOnboardingTasks(prev => prev.map(task =>
      task.id === id ? { ...task, status } : task
    ));
  };

  const addDocument = (document: Omit<Document, 'id'>) => {
    const newDoc = { ...document, id: Date.now().toString() };
    setDocuments(prev => [...prev, newDoc]);
    
    setFolders(prev => prev.map(folder =>
      folder.id === document.folderId
        ? { ...folder, documentsCount: folder.documentsCount + 1 }
        : folder
    ));
  };

  const deleteDocument = (id: string) => {
    const document = documents.find(doc => doc.id === id);
    if (document) {
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      setFolders(prev => prev.map(folder =>
        folder.id === document.folderId
          ? { ...folder, documentsCount: Math.max(0, folder.documentsCount - 1) }
          : folder
      ));
    }
  };

  const addFolder = (folder: Omit<Folder, 'id' | 'documentsCount'>) => {
    const newFolder = { ...folder, id: Date.now().toString(), documentsCount: 0 };
    setFolders(prev => [...prev, newFolder]);
  };

  const deleteFolder = (id: string) => {
    setFolders(prev => prev.filter(folder => folder.id !== id));
    setDocuments(prev => prev.filter(doc => doc.folderId !== id));
  };

  const startOnboarding = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user && !onboardingTasks.find(task => task.userId === userId)) {
      const newTask: OnboardingTask = {
        id: Date.now().toString(),
        userId,
        status: 'pending',
        progress: 0,
        tasks: [
          { id: '1', name: 'Complete profile setup', completed: false },
          { id: '2', name: 'Sign employment contract', completed: false },
          { id: '3', name: 'IT equipment setup', completed: false, dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
          { id: '4', name: 'Complete orientation training', completed: false, dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() },
          { id: '5', name: 'Meet with manager', completed: false, dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString() }
        ]
      };
      setOnboardingTasks(prev => [...prev, newTask]);
      updateUser(userId, { status: 'pending' });
    }
  };

  const completeOnboardingTask = (taskId: string, taskItemId: string) => {
    setOnboardingTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedTasks = task.tasks.map(t => 
          t.id === taskItemId ? { ...t, completed: !t.completed } : t
        );
        const progress = Math.round((updatedTasks.filter(t => t.completed).length / updatedTasks.length) * 100);
        const status = progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'pending';
        return { ...task, tasks: updatedTasks, progress, status };
      }
      return task;
    }));
  };

  const renameDocument = (id: string, newName: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, name: newName } : doc
    ));
  };

  const downloadDocument = (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (doc) {
      // Create a blob and download
      const blob = new Blob(['Mock document content'], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = doc.name;
      window.document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      window.document.body.removeChild(a);
    }
  };

  const moveDocument = (documentId: string, newFolderId: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId ? { ...doc, folderId: newFolderId } : doc
    ));
  };

  const moveFolder = (folderId: string, newParentId: string | null) => {
    setFolders(prev => prev.map(folder => 
      folder.id === folderId ? { ...folder, parentId: newParentId } : folder
    ));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('🔐 Attempting login for:', email);
    console.log('🔑 Provided password:', password);
    const credential = mockCredentials[email as keyof typeof mockCredentials];
    console.log('🔍 Found credential:', credential);
    
    if (credential && credential.password === password) {
      const user = users.find(u => u.email === email);
      console.log('👤 Found user:', user);
      if (user) {
        const now = Date.now();
        const sessionTimeout = sessionSettings.sessionTimeout * 60 * 1000; // convert to milliseconds
        
        const newSession: Session = {
          user,
          accessToken: generateToken({ userId: user.id, email: user.email }, sessionTimeout),
          refreshToken: generateToken({ userId: user.id, type: 'refresh' }, 7 * 24 * 60 * 60 * 1000), // 7 days
          expiresAt: now + sessionTimeout,
          lastActivity: now,
          sessionTimeout: sessionSettings.sessionTimeout
        };

        console.log('✅ Login successful, creating session:', newSession);
        setSession(newSession);
        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('hr_session', JSON.stringify(newSession));
        return true;
      }
    }
    console.log('❌ Login failed for:', email);
    console.log('🔍 Available credentials:', Object.keys(mockCredentials));
    return false;
  };

  const logout = () => {
    setSession(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
    setSessionTimeLeft(0);
    localStorage.removeItem('hr_session');
  };

  const extendSession = useCallback(() => {
    if (!session) return;

    const now = Date.now();
    const sessionTimeout = sessionSettings.sessionTimeout * 60 * 1000;
    
    const updatedSession: Session = {
      ...session,
      accessToken: generateToken({ userId: session.user.id, email: session.user.email }, sessionTimeout),
      expiresAt: now + sessionTimeout,
      lastActivity: now,
      sessionTimeout: sessionSettings.sessionTimeout
    };

    setSession(updatedSession);
    localStorage.setItem('hr_session', JSON.stringify(updatedSession));
  }, [session, sessionSettings.sessionTimeout]);

  // Session timer and auto-refresh
  useEffect(() => {
    if (!session || !isAuthenticated) return;

    const updateTimer = () => {
      const now = Date.now();
      const timeLeft = Math.max(0, session.expiresAt - now);
      setSessionTimeLeft(Math.floor(timeLeft / 1000));

      // Auto-refresh session якщо залишилось <= 60 секунд і autoRefresh=true
      if (sessionSettings.autoRefresh && timeLeft <= 60 * 1000 && timeLeft > 0) {
        extendSession();
      }

      // Logout якщо час вийшов
      if (timeLeft <= 0) {
        logout();
      }
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer();

    return () => clearInterval(timer);
  }, [session, isAuthenticated, sessionSettings.autoRefresh, extendSession, logout]);

  const updateSessionSettings = (settings: Partial<SessionSettings>) => {
    const newSettings = { ...sessionSettings, ...settings };
    setSessionSettings(newSettings);
    
    // If session timeout changed and user is logged in, extend session with new timeout
    if (settings.sessionTimeout && session && isAuthenticated) {
      const now = Date.now();
      const newTimeout = settings.sessionTimeout * 60 * 1000;
      
      const updatedSession: Session = {
        ...session,
        accessToken: generateToken({ userId: session.user.id, email: session.user.email }, newTimeout),
        expiresAt: now + newTimeout,
        lastActivity: now,
        sessionTimeout: settings.sessionTimeout
      };

      setSession(updatedSession);
      localStorage.setItem('hr_session', JSON.stringify(updatedSession));
    }
  };

  const updateActivity = useCallback(() => {
    if (session) {
      const updatedSession = { ...session, lastActivity: Date.now() };
      setSession(updatedSession);
      localStorage.setItem('hr_session', JSON.stringify(updatedSession));
    }
  }, [session]);

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    const userPermissions = permissions[currentUser.role as keyof typeof permissions];
    
    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log(`hasPermission check:`, {
        permission,
        userRole: currentUser.role,
        userPermissions,
        hasPermission: userPermissions?.includes(permission) || false
      });
    }
    
    return userPermissions?.includes(permission) || false;
  };

  const resetData = () => {
    setUsers(mockUsers);
    setDocuments(mockDocuments);
    setFolders(mockFolders);
    setOnboardingTasks(mockOnboardingTasks);
    localStorage.removeItem('hr_users');
    localStorage.removeItem('hr_documents');
    localStorage.removeItem('hr_folders');
    localStorage.removeItem('hr_onboarding');
  };

  const getUsersForRole = () => {
    if (!currentUser) return [];
    
    switch (currentUser.role) {
      case 'admin':
        return users; // All users
      case 'hr':
        return users; // All users for HR
      case 'manager':
        // Return users in the same department as the manager
        return users.filter(user => user.department === currentUser.department);
      case 'employee':
        // Employees can only see themselves
        return users.filter(user => user.id === currentUser.id);
      default:
        return [];
    }
  };

  const getDocumentsForRole = () => {
    if (!currentUser) return [];
    
    switch (currentUser.role) {
      case 'admin':
      case 'hr':
        return documents; // All documents
      case 'manager':
        // Documents uploaded by team members or assigned to team
        const teamUsers = users.filter(user => user.department === currentUser.department);
        const teamUserNames = teamUsers.map(user => user.name);
        return documents.filter(doc => 
          teamUserNames.includes(doc.uploadedBy) || 
          doc.uploadedBy === currentUser.name
        );
      case 'employee':
        // Only documents assigned to or uploaded by the employee
        return documents.filter(doc => 
          doc.uploadedBy === currentUser.name ||
          doc.folderId === 'assigned' // Mock assigned documents
        );
      default:
        return [];
    }
  };

  const getOnboardingTasksForRole = () => {
    if (!currentUser) return [];
    
    switch (currentUser.role) {
      case 'admin':
      case 'hr':
        return onboardingTasks; // All onboarding tasks
      case 'manager':
        // Onboarding tasks for team members
        const teamUsers = users.filter(user => user.department === currentUser.department);
        const teamUserIds = teamUsers.map(user => user.id);
        return onboardingTasks.filter(task => 
          teamUserIds.includes(task.userId) || 
          task.userId === currentUser.id
        );
      case 'employee':
        // Only their own onboarding task
        return onboardingTasks.filter(task => task.userId === currentUser.id);
      default:
        return [];
    }
  };

  const canEditUser = (userId: string) => {
    if (!currentUser) return false;
    
    const targetUser = users.find(user => user.id === userId);
    if (!targetUser) return false;
    
    switch (currentUser.role) {
      case 'admin':
        return true; // Can edit anyone
      case 'hr':
        return true; // HR can edit anyone
      case 'manager':
        // Can edit team members
        return targetUser.department === currentUser.department;
      case 'employee':
        // Can only edit themselves
        return userId === currentUser.id;
      default:
        return false;
    }
  };

  const canAccessDocument = (documentId: string) => {
    if (!currentUser) return false;
    
    const document = documents.find(doc => doc.id === documentId);
    if (!document) return false;
    
    switch (currentUser.role) {
      case 'admin':
      case 'hr':
        return true; // Can access all documents
      case 'manager':
        // Can access team documents
        const teamUsers = users.filter(user => user.department === currentUser.department);
        const teamUserNames = teamUsers.map(user => user.name);
        return teamUserNames.includes(document.uploadedBy) || 
               document.uploadedBy === currentUser.name;
      case 'employee':
        // Can only access their own documents or assigned ones
        return document.uploadedBy === currentUser.name ||
               document.folderId === 'assigned';
      default:
        return false;
    }
  };

  const canAccessOnboarding = (taskId: string) => {
    if (!currentUser) return false;
    
    const task = onboardingTasks.find(t => t.id === taskId);
    if (!task) return false;
    
    switch (currentUser.role) {
      case 'admin':
      case 'hr':
        return true; // Can access all onboarding tasks
      case 'manager':
        // Can access team onboarding tasks
        const teamUsers = users.filter(user => user.department === currentUser.department);
        const teamUserIds = teamUsers.map(user => user.id);
        return teamUserIds.includes(task.userId) || 
               task.userId === currentUser.id;
      case 'employee':
        // Can only access their own onboarding task
        return task.userId === currentUser.id;
      default:
        return false;
    }
  };

  const getDashboardStats = () => {
    if (!currentUser) return {};
    
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    switch (currentUser.role) {
      case 'admin':
        return {
          totalEmployees: users.length,
          activeEmployees: users.filter(u => u.status === 'active').length,
          inactiveEmployees: users.filter(u => u.status === 'inactive').length,
          pendingEmployees: users.filter(u => u.status === 'pending').length,
          totalOnboarding: onboardingTasks.length,
          inProgressOnboarding: onboardingTasks.filter(t => t.status === 'in-progress').length,
          completedOnboarding: onboardingTasks.filter(t => t.status === 'completed').length,
          totalDocuments: documents.length,
          recentActivity: users.filter(u => new Date(u.joinDate) > sevenDaysAgo).length,
          roleDistribution: {
            employees: users.filter(u => u.role === 'employee').length,
            managers: users.filter(u => u.role === 'manager').length,
            hr: users.filter(u => u.role === 'hr').length,
            admins: users.filter(u => u.role === 'admin').length,
          },
          departmentStats: users.reduce((acc, user) => {
            acc[user.department] = (acc[user.department] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        };
        
      case 'hr':
        return {
          totalEmployees: users.length,
          activeEmployees: users.filter(u => u.status === 'active').length,
          pendingEmployees: users.filter(u => u.status === 'pending').length,
          totalOnboarding: onboardingTasks.length,
          inProgressOnboarding: onboardingTasks.filter(t => t.status === 'in-progress').length,
          completedOnboarding: onboardingTasks.filter(t => t.status === 'completed').length,
          overdueOnboarding: onboardingTasks.filter(t => t.status === 'overdue').length,
          averageOnboardingDuration: 14, // Mock average in days
          recentlyAddedEmployees: users.filter(u => new Date(u.joinDate) > sevenDaysAgo).slice(0, 5),
          recentActivity: onboardingTasks.filter(t => t.status === 'in-progress' || t.status === 'pending').length
        };
        
      case 'manager':
        const teamUsers = users.filter(u => u.department === currentUser.department);
        const teamOnboarding = onboardingTasks.filter(t => 
          teamUsers.some(u => u.id === t.userId)
        );
        return {
          teamSize: teamUsers.length,
          activeTeamMembers: teamUsers.filter(u => u.status === 'active').length,
          teamOnboardingInProgress: teamOnboarding.filter(t => t.status === 'in-progress').length,
          teamOnboardingCompleted: teamOnboarding.filter(t => t.status === 'completed').length,
          teamOnboardingPending: teamOnboarding.filter(t => t.status === 'pending').length,
          recentTeamActivity: teamUsers.filter(u => new Date(u.joinDate) > sevenDaysAgo).length,
          teamDocuments: documents.filter(d => 
            teamUsers.some(u => u.name === d.uploadedBy)
          ).length
        };
        
      case 'employee':
        const userOnboarding = onboardingTasks.find(t => t.userId === currentUser.id);
        return {
          onboardingStatus: userOnboarding?.status || 'not-started',
          onboardingProgress: Math.max(0, Math.min(100, userOnboarding?.progress || 0)),
          assignedDocuments: documents.filter(d => 
            d.uploadedBy === currentUser.name || d.folderId === 'assigned'
          ).length,
          upcomingDeadlines: userOnboarding?.tasks.filter(t => !t.completed && t.dueDate) || [],
          joinDate: currentUser.joinDate,
          department: currentUser.department
        };
        
      default:
        return {};
    }
  };

  return (
    <AppContext.Provider value={{
      users,
      documents,
      folders,
      onboardingTasks,
      currentUser,
      isAuthenticated,
      session,
      sessionSettings,
      sessionTimeLeft,
      isSessionLoading,
      updateUser,
      updateOnboardingStatus,
      addDocument,
      deleteDocument,
      addFolder,
      deleteFolder,
      startOnboarding,
      completeOnboardingTask,
      renameDocument,
      downloadDocument,
      moveDocument,
      moveFolder,
      login,
      logout,
      hasPermission,
      resetData,
      updateSessionSettings,
      extendSession,
      updateActivity,
      getUsersForRole,
      getDocumentsForRole,
      getOnboardingTasksForRole,
      canEditUser,
      canAccessDocument,
      canAccessOnboarding,
      getDashboardStats,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
