export interface Task {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface TimeLog {
  id: string;
  task_id: string;
  user_id: string;
  hours: number;
  minutes: number;
  date: string;
  created_at: string;
}