import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { TimeLog } from '../types/task';

interface TimeLogState {
  timeLogs: TimeLog[];
  loading: boolean;
  error: string | null;
  fetchTimeLogs: () => Promise<void>;
  addTimeLog: (taskId: string, hours: number, minutes: number, date: string) => Promise<void>;
  deleteTimeLog: (id: string) => Promise<void>;
}

export const useTimeLogStore = create<TimeLogState>((set, get) => ({
  timeLogs: [],
  loading: false,
  error: null,
  fetchTimeLogs: async () => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('time_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      if (error) throw error;
      set({ timeLogs: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  addTimeLog: async (taskId: string, hours: number, minutes: number, date: string) => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('time_logs')
        .insert([{
          task_id: taskId,
          user_id: user.id,
          hours,
          minutes,
          date: date,
        }])
        .select()
        .single();
      
      if (error) throw error;
      const currentLogs = get().timeLogs;
      set({ timeLogs: [data, ...currentLogs] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  deleteTimeLog: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('time_logs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      const currentLogs = get().timeLogs;
      set({ timeLogs: currentLogs.filter(log => log.id !== id) });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));