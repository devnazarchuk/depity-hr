'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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

interface AppContextType {
  users: User[];
  documents: Document[];
  folders: Folder[];
  onboardingTasks: OnboardingTask[];
  currentUser: User | null;
  updateUser: (id: string, updates: Partial<User>) => void;
  updateOnboardingStatus: (id: string, status: OnboardingTask['status']) => void;
  addDocument: (document: Omit<Document, 'id'>) => void;
  deleteDocument: (id: string) => void;
  addFolder: (folder: Omit<Folder, 'id' | 'documentsCount'>) => void;
  deleteFolder: (id: string) => void;
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
  }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [folders, setFolders] = useState<Folder[]>(mockFolders);
  const [onboardingTasks, setOnboardingTasks] = useState<OnboardingTask[]>(mockOnboardingTasks);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    setCurrentUser(mockUsers[0]); // Set admin as current user
  }, []);

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...updates } : user
    ));
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

  return (
    <AppContext.Provider value={{
      users,
      documents,
      folders,
      onboardingTasks,
      currentUser,
      updateUser,
      updateOnboardingStatus,
      addDocument,
      deleteDocument,
      addFolder,
      deleteFolder
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