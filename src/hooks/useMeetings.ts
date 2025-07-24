import { useState, useEffect } from 'react';
import { Meeting } from '../types/meeting';
import { 
  getMeetings, 
  saveMeeting, 
  deleteMeeting, 
  updateMeeting, 
  getMeetingsByDate,
  initializeSampleMeetings 
} from '../utils/meetingStorage';

export const useMeetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshMeetings = () => {
    const allMeetings = getMeetings();
    setMeetings(allMeetings);
  };

  useEffect(() => {
    initializeSampleMeetings();
    refreshMeetings();
    setLoading(false);
  }, []);

  const addMeeting = (meeting: Meeting) => {
    saveMeeting(meeting);
    refreshMeetings();
  };

  const removeMeeting = (meetingId: string) => {
    deleteMeeting(meetingId);
    refreshMeetings();
  };

  const editMeeting = (meetingId: string, updates: Partial<Meeting>) => {
    updateMeeting(meetingId, updates);
    refreshMeetings();
  };

  const getMeetingsForDate = (date: string): Meeting[] => {
    return getMeetingsByDate(date);
  };

  // Helper function to format date as YYYY-MM-DD without timezone issues
  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getMeetingsForWeek = (startDate: Date): Meeting[] => {
    const weekMeetings: Meeting[] = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = formatDateString(currentDate);
      weekMeetings.push(...getMeetingsByDate(dateStr));
    }
    return weekMeetings.sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      return a.startTime.localeCompare(b.startTime);
    });
  };

  return {
    meetings,
    loading,
    addMeeting,
    removeMeeting,
    editMeeting,
    getMeetingsForDate,
    getMeetingsForWeek,
    refreshMeetings
  };
};