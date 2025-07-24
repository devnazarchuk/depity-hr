export interface Task {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  assignedTo?: string;
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
}