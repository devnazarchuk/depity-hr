import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Building, Video, FileText } from 'lucide-react';
import { Meeting } from '../../types/meeting';
import { generateMeetingId } from '../../utils/meetingStorage';

interface MeetingFormProps {
  meeting?: Meeting;
  onSubmit: (meeting: Meeting) => void;
  onCancel: () => void;
  selectedDate?: string;
}

  // Helper function to format date as YYYY-MM-DD without timezone issues
  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

const MeetingForm: React.FC<MeetingFormProps> = ({ 
  meeting, 
  onSubmit, 
  onCancel, 
  selectedDate 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    date: selectedDate || formatDateString(new Date()),
    startTime: '09:00',
    endTime: '10:00',
    participants: [] as string[],
    department: 'Marketing' as Meeting['department'],
    platform: 'Google Meet' as Meeting['platform'],
    notes: ''
  });

  const [participantInput, setParticipantInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (meeting) {
      setFormData({
        title: meeting.title,
        date: meeting.date,
        startTime: meeting.startTime,
        endTime: meeting.endTime,
        participants: meeting.participants,
        department: meeting.department,
        platform: meeting.platform,
        notes: meeting.notes || ''
      });
    }
  }, [meeting]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Meeting title is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (formData.startTime >= formData.endTime) {
      newErrors.time = 'End time must be after start time';
    }

    if (formData.participants.length === 0) {
      newErrors.participants = 'At least one participant is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const meetingData: Meeting = {
      id: meeting?.id || generateMeetingId(),
      title: formData.title,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      participants: formData.participants,
      department: formData.department,
      platform: formData.platform,
      notes: formData.notes,
      createdAt: meeting?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSubmit(meetingData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addParticipant = () => {
    if (participantInput.trim() && !formData.participants.includes(participantInput.trim())) {
      handleChange('participants', [...formData.participants, participantInput.trim()]);
      setParticipantInput('');
    }
  };

  const removeParticipant = (participant: string) => {
    handleChange('participants', formData.participants.filter(p => p !== participant));
  };

  const handleParticipantKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addParticipant();
    }
  };

  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeOptions.push(timeStr);
    }
  }

  const getDepartmentColor = (dept: string) => {
    switch (dept) {
      case 'Marketing': return 'bg-orange-500';
      case 'Product': return 'bg-purple-500';
      case 'Engineering': return 'bg-blue-500';
      case 'HR': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <FileText className="w-4 h-4 inline mr-2" />
          Meeting Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter meeting title..."
          className={`w-full bg-gray-700 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            errors.title ? 'border-red-500' : 'border-gray-600'
          }`}
        />
        {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          />
          {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Clock className="w-4 h-4 inline mr-2" />
            Start Time
          </label>
          <select
            value={formData.startTime}
            onChange={(e) => handleChange('startTime', e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {timeOptions.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            End Time
          </label>
          <select
            value={formData.endTime}
            onChange={(e) => handleChange('endTime', e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {timeOptions.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          {errors.time && <p className="text-red-400 text-sm mt-1">{errors.time}</p>}
        </div>
      </div>

      {/* Department and Platform */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Building className="w-4 h-4 inline mr-2" />
            Department
          </label>
          <select
            value={formData.department}
            onChange={(e) => handleChange('department', e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="Marketing">Marketing</option>
            <option value="Product">Product</option>
            <option value="Engineering">Engineering</option>
            <option value="HR">HR</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Video className="w-4 h-4 inline mr-2" />
            Platform
          </label>
          <div className="space-y-2">
            {(['Google Meet', 'Zoom', 'Internal'] as const).map(platform => (
              <label key={platform} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="platform"
                  value={platform}
                  checked={formData.platform === platform}
                  onChange={(e) => handleChange('platform', e.target.value)}
                  className="text-purple-500 focus:ring-purple-500"
                />
                <span className="text-gray-300">{platform}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Participants */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <Users className="w-4 h-4 inline mr-2" />
          Participants
        </label>
        <div className="flex space-x-2 mb-3">
          <input
            type="text"
            value={participantInput}
            onChange={(e) => setParticipantInput(e.target.value)}
            onKeyPress={handleParticipantKeyPress}
            placeholder="Add participant name..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="button"
            onClick={addParticipant}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add
          </button>
        </div>
        
        {formData.participants.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.participants.map(participant => (
              <span
                key={participant}
                className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2"
              >
                <span>{participant}</span>
                <button
                  type="button"
                  onClick={() => removeParticipant(participant)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        {errors.participants && <p className="text-red-400 text-sm mt-1">{errors.participants}</p>}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Notes (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Add meeting notes or agenda..."
          rows={3}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {meeting ? 'Update Meeting' : 'Create Meeting'}
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

export default MeetingForm;