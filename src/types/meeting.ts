export interface Meeting {
  id: string;
  title: string;
  date: string; // ISO format
  startTime: string; // e.g. "10:00"
  endTime: string;   // e.g. "11:30"
  participants: string[];
  department: 'Marketing' | 'Product' | 'Engineering' | 'HR';
  platform: 'Zoom' | 'Google Meet' | 'Internal';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}