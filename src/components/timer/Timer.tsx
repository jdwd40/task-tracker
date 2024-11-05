import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { useTimeLogStore } from '../../store/timeLogStore';
import { TimeLogList } from './TimeLogList';

export const Timer: React.FC = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const { tasks, fetchTasks } = useTaskStore();
  const { addTimeLog, timeLogs, fetchTimeLogs } = useTimeLogStore();

  useEffect(() => {
    fetchTasks();
    fetchTimeLogs();
  }, [fetchTasks, fetchTimeLogs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskId || (hours === 0 && minutes === 0)) return;

    try {
      await addTimeLog(selectedTaskId, hours, minutes, date);
      await fetchTimeLogs(); // Refresh time logs after adding new entry
      setSelectedTaskId('');
      setHours(0);
      setMinutes(0);
    } catch (error) {
      console.error('Failed to save time log:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Time Entry</h2>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="task" className="block text-sm font-medium text-gray-700">
              Select Task
            </label>
            <select
              id="task"
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            >
              <option value="">Select a task...</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="hours" className="block text-sm font-medium text-gray-700">
                Hours
              </label>
              <input
                type="number"
                id="hours"
                min="0"
                max="24"
                value={hours}
                onChange={(e) => setHours(Math.min(24, Math.max(0, parseInt(e.target.value) || 0)))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="minutes" className="block text-sm font-medium text-gray-700">
                Minutes
              </label>
              <input
                type="number"
                id="minutes"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedTaskId || (hours === 0 && minutes === 0)}
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Clock className="w-4 h-4 mr-2" />
            Log Time
          </button>
        </form>
      </div>

      <TimeLogList timeLogs={timeLogs} tasks={tasks} />
    </div>
  );
};