import { useState, useEffect } from 'react';
import { Task } from '../types/task';
import { 
  getTasks, 
  saveTask, 
  deleteTask, 
  updateTask,
  initializeSampleTasks 
} from '../utils/taskStorage';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshTasks = () => {
    const allTasks = getTasks();
    setTasks(allTasks);
  };

  useEffect(() => {
    initializeSampleTasks();
    refreshTasks();
    setLoading(false);
  }, []);

  const addTask = (task: Task) => {
    saveTask(task);
    refreshTasks();
  };

  const removeTask = (taskId: string) => {
    deleteTask(taskId);
    refreshTasks();
  };

  const editTask = (task: Task) => {
    updateTask(task);
    refreshTasks();
  };

  const toggleTaskCompletion = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const updatedTask = { ...task, completed: !task.completed };
      updateTask(updatedTask);
      refreshTasks();
    }
  };

  const getTasksByTag = (tag: string): Task[] => {
    return tasks.filter(task => task.tags.includes(tag));
  };

  const getTasksByPriority = (priority: Task['priority']): Task[] => {
    return tasks.filter(task => task.priority === priority);
  };

  const getCompletedTasks = (): Task[] => {
    return tasks.filter(task => task.completed);
  };

  const getPendingTasks = (): Task[] => {
    return tasks.filter(task => !task.completed);
  };

  const getAllTags = (): string[] => {
    const allTags = tasks.flatMap(task => task.tags);
    return [...new Set(allTags)];
  };

  return {
    tasks,
    loading,
    addTask,
    removeTask,
    editTask,
    toggleTaskCompletion,
    getTasksByTag,
    getTasksByPriority,
    getCompletedTasks,
    getPendingTasks,
    getAllTags,
    refreshTasks
  };
};