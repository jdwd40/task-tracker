import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Task } from '../types/task';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (name: string, description?: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTask: (id: string, name: string, description?: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,
  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      set({ tasks: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  addTask: async (name: string, description?: string) => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('tasks')
        .insert([{ 
          name, 
          description,
          user_id: user.id 
        }])
        .select()
        .single();
      
      if (error) throw error;
      set({ tasks: [data, ...get().tasks] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  deleteTask: async (id: string) => {
    set({ loading: true, error: null });
    try {
      // First, delete all time logs associated with this task
      const { error: timeLogsError } = await supabase
        .from('time_logs')
        .delete()
        .eq('task_id', id);
      
      if (timeLogsError) throw timeLogsError;

      // Then delete the task itself
      const { error: taskError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (taskError) throw taskError;

      // Update local state
      const currentTasks = get().tasks;
      set({ tasks: currentTasks.filter(task => task.id !== id) });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  updateTask: async (id: string, name: string, description?: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ name, description })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      const currentTasks = get().tasks;
      set({
        tasks: currentTasks.map(task =>
          task.id === id ? data : task
        ),
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));