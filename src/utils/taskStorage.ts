import { Task } from '../types/task';

const TASKS_KEY = 'depity_tasks';

export const getTasks = (): Task[] => {
  try {
    const stored = localStorage.getItem(TASKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading tasks from localStorage:', error);
    return [];
  }
};

export const saveTask = (task: Task): void => {
  try {
    const tasks = getTasks();
    const existingIndex = tasks.findIndex(t => t.id === task.id);
    
    if (existingIndex >= 0) {
      tasks[existingIndex] = { ...task, updatedAt: new Date().toISOString() };
    } else {
      tasks.push({ ...task, createdAt: new Date().toISOString() });
    }
    
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving task to localStorage:', error);
  }
};

export const updateTask = (task: Task): void => {
  try {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(t => t.id === task.id);
    
    if (taskIndex >= 0) {
      tasks[taskIndex] = { ...task, updatedAt: new Date().toISOString() };
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    }
  } catch (error) {
    console.error('Error updating task in localStorage:', error);
  }
};

export const deleteTask = (id: string): void => {
  try {
    const tasks = getTasks();
    const filtered = tasks.filter(t => t.id !== id);
    localStorage.setItem(TASKS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting task from localStorage:', error);
  }
};

export const generateTaskId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const initializeSampleTasks = (): void => {
  const existing = getTasks();
  if (existing.length === 0) {
    const sampleTasks: Task[] = [
      {
        id: generateTaskId(),
        title: 'Text inputs for Design System',
        description: 'Search for integration to provide a comprehensive input component library',
        tags: ['Tedio', 'Recoil'],
        assignedTo: 'Emma Wright',
        priority: 'High',
        dueDate: '2024-02-02',
        completed: false,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: generateTaskId(),
        title: 'Check neutral and state colors',
        description: 'Button components will review a lovid color palette for consistency',
        tags: ['Lingelty', 'Pessinel'],
        assignedTo: 'Emma Wright',
        priority: 'Medium',
        dueDate: '2024-02-09',
        completed: true,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: generateTaskId(),
        title: 'Implement user authentication',
        description: 'Set up secure login and registration system with proper validation',
        tags: ['Auth', 'Security'],
        assignedTo: 'Arthur Taylor',
        priority: 'High',
        dueDate: '2024-02-15',
        completed: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: generateTaskId(),
        title: 'Marketing campaign analysis',
        description: 'Analyze Q2 marketing performance and prepare recommendations',
        tags: ['Analytics', 'Marketing'],
        assignedTo: 'James Brown',
        priority: 'Medium',
        dueDate: '2024-02-05',
        completed: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    sampleTasks.forEach(task => saveTask(task));
  }
};