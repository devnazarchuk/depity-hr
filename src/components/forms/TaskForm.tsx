import React, { useState, useEffect } from 'react';
import { CheckSquare, Calendar, Tag, User, AlertCircle, FileText } from 'lucide-react';
import { Task } from '../../types/task';
import { generateTaskId } from '../../utils/taskStorage';

interface TaskFormProps {
  task?: Task;
  onSubmit: (task: Task) => void;
  onCancel: () => void;
  existingTags?: string[];
}

const TaskForm: React.FC<TaskFormProps> = ({ 
  task, 
  onSubmit, 
  onCancel, 
  existingTags = [] 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [] as string[],
    assignedTo: '',
    priority: 'Medium' as Task['priority'],
    dueDate: ''
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        tags: task.tags,
        assignedTo: task.assignedTo || '',
        priority: task.priority,
        dueDate: task.dueDate || ''
      });
    }
  }, [task]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const taskData: Task = {
      id: task?.id || generateTaskId(),
      title: formData.title,
      description: formData.description || undefined,
      tags: formData.tags,
      assignedTo: formData.assignedTo || undefined,
      priority: formData.priority,
      dueDate: formData.dueDate || undefined,
      completed: task?.completed || false,
      createdAt: task?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSubmit(taskData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addTag = (tagName: string) => {
    const trimmedTag = tagName.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      handleChange('tags', [...formData.tags, trimmedTag]);
      setTagInput('');
      setShowTagSuggestions(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput);
    }
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
    const colors = ['bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-red-500', 'bg-indigo-500'];
    return colors[index % colors.length];
  };

  const filteredSuggestions = existingTags.filter(tag => 
    tag.toLowerCase().includes(tagInput.toLowerCase()) && 
    !formData.tags.includes(tag)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <CheckSquare className="w-4 h-4 inline mr-2" />
          Task Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter task title..."
          className={`w-full bg-gray-700 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            errors.title ? 'border-red-500' : 'border-gray-600'
          }`}
        />
        {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <FileText className="w-4 h-4 inline mr-2" />
          Description (Optional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Add task description..."
          rows={3}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />
      </div>

      {/* Priority and Due Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <AlertCircle className="w-4 h-4 inline mr-2" />
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Due Date (Optional)
          </label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            className={`w-full bg-gray-700 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.dueDate ? 'border-red-500' : 'border-gray-600'
            }`}
            min={(() => {
              const today = new Date();
              const year = today.getFullYear();
              const month = String(today.getMonth() + 1).padStart(2, '0');
              const day = String(today.getDate()).padStart(2, '0');
              return `${year}-${month}-${day}`;
            })()}
          />
          {errors.dueDate && <p className="text-red-400 text-sm mt-1">{errors.dueDate}</p>}
        </div>
      </div>

      {/* Assigned To */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <User className="w-4 h-4 inline mr-2" />
          Assigned To (Optional)
        </label>
        <input
          type="text"
          value={formData.assignedTo}
          onChange={(e) => handleChange('assignedTo', e.target.value)}
          placeholder="Enter assignee name..."
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <Tag className="w-4 h-4 inline mr-2" />
          Tags
        </label>
        <div className="relative">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => {
              setTagInput(e.target.value);
              setShowTagSuggestions(e.target.value.length > 0);
            }}
            onKeyPress={handleTagKeyPress}
            onFocus={() => setShowTagSuggestions(tagInput.length > 0)}
            onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
            placeholder="Add tags..."
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          
          {/* Tag Suggestions */}
          {showTagSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-32 overflow-y-auto">
              {filteredSuggestions.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  className="w-full text-left px-4 py-2 text-white hover:bg-gray-600 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Current Tags */}
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.tags.map((tag, index) => (
              <span
                key={tag}
                className={`text-xs px-3 py-1 rounded-full text-white flex items-center space-x-2 ${getTagColor(index)}`}
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-white hover:text-gray-300 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {task ? 'Update Task' : 'Create Task'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm;