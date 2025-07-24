import { Meeting } from '../types/meeting';

const MEETINGS_KEY = 'depity_meetings';

export const getMeetings = (): Meeting[] => {
  try {
    const stored = localStorage.getItem(MEETINGS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading meetings from localStorage:', error);
    return [];
  }
};

export const saveMeeting = (meeting: Meeting): void => {
  try {
    const meetings = getMeetings();
    const existingIndex = meetings.findIndex(m => m.id === meeting.id);
    
    if (existingIndex >= 0) {
      meetings[existingIndex] = { ...meeting, updatedAt: new Date().toISOString() };
    } else {
      meetings.push({ ...meeting, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    localStorage.setItem(MEETINGS_KEY, JSON.stringify(meetings));
  } catch (error) {
    console.error('Error saving meeting to localStorage:', error);
  }
};

export const deleteMeeting = (meetingId: string): void => {
  try {
    const meetings = getMeetings();
    const filtered = meetings.filter(m => m.id !== meetingId);
    localStorage.setItem(MEETINGS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting meeting from localStorage:', error);
  }
};

export const updateMeeting = (meetingId: string, updates: Partial<Meeting>): void => {
  try {
    const meetings = getMeetings();
    const meetingIndex = meetings.findIndex(m => m.id === meetingId);
    
    if (meetingIndex >= 0) {
      meetings[meetingIndex] = { 
        ...meetings[meetingIndex], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      localStorage.setItem(MEETINGS_KEY, JSON.stringify(meetings));
    }
  } catch (error) {
    console.error('Error updating meeting in localStorage:', error);
  }
};

export const getMeetingsByDate = (date: string): Meeting[] => {
  return getMeetings().filter(meeting => meeting.date === date);
};

export const getMeetingsByDateRange = (startDate: string, endDate: string): Meeting[] => {
  const meetings = getMeetings();
  return meetings.filter(meeting => meeting.date >= startDate && meeting.date <= endDate);
};

export const generateMeetingId = (): string => {
  return `meeting_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Helper function to format date as YYYY-MM-DD without timezone issues
const formatDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Initialize with sample data if empty
export const initializeSampleMeetings = (): void => {
  const existing = getMeetings();
  if (existing.length === 0) {
    const today = formatDateString(new Date());
    const tomorrow = formatDateString(new Date(Date.now() + 86400000));
    
    const sampleMeetings: Meeting[] = [
      {
        id: generateMeetingId(),
        title: 'Meeting with James Brown',
        date: today,
        startTime: '09:00',
        endTime: '10:00',
        participants: ['James Brown', 'Sophia Williams'],
        department: 'Marketing',
        platform: 'Google Meet',
        notes: 'Quarterly marketing review and strategy discussion',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: generateMeetingId(),
        title: 'Meeting with Laura Perez',
        date: today,
        startTime: '10:00',
        endTime: '10:45',
        participants: ['Laura Perez', 'Sophia Williams'],
        department: 'Product',
        platform: 'Zoom',
        notes: 'Product roadmap planning session',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: generateMeetingId(),
        title: 'Team Standup',
        date: tomorrow,
        startTime: '09:30',
        endTime: '10:00',
        participants: ['Sophia Williams', 'Arthur Taylor', 'Emma Wright'],
        department: 'Engineering',
        platform: 'Internal',
        notes: 'Daily team standup meeting',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    sampleMeetings.forEach(meeting => saveMeeting(meeting));
  }
};