import React, { useState } from 'react';
import { Calendar, Clock, FileText } from 'lucide-react';
import { TimeOffRequest, generateId, formatDateTime, getCurrentUser, getTimeOffRequests, setTimeOffRequests } from '../../utils/storage';

interface TimeOffFormProps {
  onSubmit: (request: TimeOffRequest) => void;
  onCancel: () => void;
}

const TimeOffForm: React.FC<TimeOffFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    date: '',
    type: 'vacation' as TimeOffRequest['type'],
    reason: '',
    days: 1
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'Cannot request time off for past dates';
      }
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    }

    if (formData.days < 1 || formData.days > 30) {
      newErrors.days = 'Days must be between 1 and 30';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert('User not found. Please refresh and try again.');
      return;
    }

    const newRequest: TimeOffRequest = {
      id: generateId(),
      userId: currentUser.id,
      date: formData.date,
      type: formData.type,
      status: 'pending',
      reason: formData.reason,
      days: formData.days,
      createdAt: formatDateTime(new Date())
    };

    // Save to localStorage
    const existingRequests = getTimeOffRequests();
    const updatedRequests = [newRequest, ...existingRequests];
    setTimeOffRequests(updatedRequests);

    onSubmit(newRequest);
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <Calendar className="w-4 h-4 inline mr-2" />
          Date
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
          className={`w-full bg-gray-700 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            errors.date ? 'border-red-500' : 'border-gray-600'
          }`}
                      min={(() => {
              const today = new Date();
              const year = today.getFullYear();
              const month = String(today.getMonth() + 1).padStart(2, '0');
              const day = String(today.getDate()).padStart(2, '0');
              return `${year}-${month}-${day}`;
            })()}
        />
        {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date}</p>}
      </div>

      {/* Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <Clock className="w-4 h-4 inline mr-2" />
          Type
        </label>
        <select
          value={formData.type}
          onChange={(e) => handleChange('type', e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="vacation">Vacation</option>
          <option value="sick">Sick Leave</option>
          <option value="personal">Personal</option>
          <option value="bereavement">Bereavement</option>
        </select>
      </div>

      {/* Days */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Number of Days
        </label>
        <input
          type="number"
          min="1"
          max="30"
          value={formData.days}
          onChange={(e) => handleChange('days', parseInt(e.target.value) || 1)}
          className={`w-full bg-gray-700 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            errors.days ? 'border-red-500' : 'border-gray-600'
          }`}
        />
        {errors.days && <p className="text-red-400 text-sm mt-1">{errors.days}</p>}
      </div>

      {/* Reason */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <FileText className="w-4 h-4 inline mr-2" />
          Reason
        </label>
        <textarea
          value={formData.reason}
          onChange={(e) => handleChange('reason', e.target.value)}
          placeholder="Please provide a reason for your time off request..."
          rows={3}
          className={`w-full bg-gray-700 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${
            errors.reason ? 'border-red-500' : 'border-gray-600'
          }`}
        />
        {errors.reason && <p className="text-red-400 text-sm mt-1">{errors.reason}</p>}
      </div>

      {/* Actions */}
      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Submit Request
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

export default TimeOffForm;