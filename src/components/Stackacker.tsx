import React from 'react';
import { CheckSquare, Square, Plus, Edit, Trash2, Calendar, User, Filter } from 'lucide-react';
import { Task } from '../types/task';
import { useTasks } from '../hooks/useTasks';
import TaskModal from './modals/TaskModal';
import { useState } from 'react';

const Stackacker: React.FC = () => {
  const { 
    tasks, 
    addTask, 
    removeTask, 
    editTask, 
    toggleTaskCompletion, 
    getAllTags 
  } = useTasks();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [showCompleted, setShowCompleted] = useState(true);

  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter(task => {
    if (!showCompleted && task.completed) return false;
    
    if (selectedTags.length > 0) {
      const hasSelectedTag = selectedTags.some(tag => task.tags.includes(tag));
      if (!hasSelectedTag) return false;
    }
    
    if (selectedPriority && task.priority !== selectedPriority) {
      return false;
    }
    
    return true;
  });

  // Sort tasks: incomplete first, then by priority, then by due date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    
    return 0;
  });

  const allTags = getAllTags();

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      removeTask(taskId);
    }
  };

  const handleTaskSubmit = (task: Task) => {
    if (editingTask) {
      editTask(task);
    } else {
      addTask(task);
    }
  };

  const toggleTagFilter = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-amber-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTagColor = (index: number) => {
    const colors = ['bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-red-500'];
    return colors[index % colors.length];
  };

  const formatDueDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays <= 7) return `${diffDays} days`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (dateString?: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 text-white border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-purple-500/20 rounded-xl">
            <CheckSquare className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Stackacker</h2>
          <span className="text-sm text-gray-400">
            ({sortedTasks.length} task{sortedTasks.length !== 1 ? 's' : ''})
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleCreateTask}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
          <button className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium">
            See All
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
        {/* Priority Filter */}
        <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:space-x-2">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <div className="p-1.5 bg-gray-700/50 rounded-lg">
              <Filter className="w-3 h-3 text-gray-400" />
            </div>
            <span className="text-sm text-gray-400 font-medium">Priority:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedPriority('')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                selectedPriority === '' 
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg' 
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              All
            </button>
            {['High', 'Medium', 'Low'].map(priority => (
              <button
                key={priority}
                onClick={() => setSelectedPriority(selectedPriority === priority ? '' : priority)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                  selectedPriority === priority 
                    ? `${getPriorityColor(priority)} text-white shadow-lg` 
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {priority}
              </button>
            ))}
          </div>
        </div>

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:space-x-2">
            <div className="flex items-center space-x-2 mb-2 sm:mb-0">
              <span className="text-sm text-gray-400 font-medium">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag, index) => (
                <button
                  key={tag}
                  onClick={() => toggleTagFilter(tag)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                    selectedTags.includes(tag)
                      ? `${getTagColor(index)} text-white shadow-lg`
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Show Completed Toggle */}
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              className="w-4 h-4 rounded text-purple-500 focus:ring-purple-500 focus:ring-2"
            />
            <span className="text-xs sm:text-sm text-gray-400 font-medium group-hover:text-gray-300 transition-colors">Show completed tasks</span>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="p-4 bg-gray-700/50 rounded-2xl w-fit mx-auto mb-4">
              <CheckSquare className="w-12 h-12 mx-auto opacity-50" />
            </div>
            <p className="font-medium mb-2">No tasks found</p>
            <button 
              onClick={handleCreateTask}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium"
            >
              Create your first task
            </button>
          </div>
        ) : (
          sortedTasks.map((task, index) => (
            <div key={task.id} className={`bg-white/5 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/10 transition-all duration-300 group border border-white/5 hover:border-white/10 ${
              task.completed ? 'opacity-60' : ''
            }`}>
              <div className="flex items-start space-x-4">
                <button 
                  onClick={() => toggleTaskCompletion(task.id)}
                  className="mt-1 text-purple-400 hover:text-purple-300 transition-all duration-300 p-1 rounded-lg hover:bg-purple-500/20"
                >
                {task.completed ? (
                    <CheckSquare className="w-5 h-5" />
                ) : (
                    <Square className="w-5 h-5" />
                )}
              </button>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                      <h3 className={`font-semibold mb-2 text-sm sm:text-base break-words leading-tight ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                        {task.title}
                      </h3>
                    {task.description && (
                        <p className="text-xs sm:text-sm text-gray-400 mb-3 leading-relaxed break-words line-clamp-2">{task.description}</p>
                    )}
                  </div>
                  
                    <div className="flex items-center space-x-1 sm:space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ml-2">
                    <button
                      onClick={() => handleEditTask(task)}
                        className="p-1.5 sm:p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-300"
                      title="Edit task"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 sm:p-2 rounded-xl hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all duration-300"
                      title="Delete task"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
                
                  <div className="flex flex-col space-y-3 mt-4">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    {/* Priority Badge */}
                      <span className={`text-xs px-2 py-1 rounded-lg text-white font-semibold shadow-lg ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    
                    {/* Tags */}
                      <div className="flex items-center gap-1">
                      {task.tags.map((tag, tagIndex) => (
                          <span
                            key={tag}
                            className={`text-xs px-2 py-1 rounded-lg text-white font-semibold shadow-lg ${getTagColor(tagIndex)}`}
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {/* Assignee */}
                    {task.assignedTo && (
                        <div className="flex items-center space-x-1.5 text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded-lg min-w-0 flex-1">
                          <User className="w-3 h-3 flex-shrink-0" />
                          <span className="font-medium truncate">{task.assignedTo}</span>
                      </div>
                    )}
                  
                  {/* Due Date */}
                  {task.dueDate && (
                      <div className={`flex items-center space-x-1.5 text-xs px-2 py-1 rounded-lg font-medium ${
                      isOverdue(task.dueDate) && !task.completed 
                          ? 'text-red-400 bg-red-500/20' 
                          : 'text-gray-400 bg-gray-700/50'
                    }`}>
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span>{formatDueDate(task.dueDate)}</span>
                    </div>
                  )}
                </div>
                </div>
              </div>
            </div>
          </div>
          ))
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={editingTask}
        onSubmit={handleTaskSubmit}
        existingTags={allTags}
      />
    </div>
  );
};

export default Stackacker;