import React from 'react';
import { Trash2 } from 'lucide-react';
import { useTimeLogStore } from '../../store/timeLogStore';
import type { TimeLog, Task } from '../../types/task';

interface TimeLogListProps {
  timeLogs: TimeLog[];
  tasks: Task[];
}

export const TimeLogList: React.FC<TimeLogListProps> = ({ timeLogs, tasks }) => {
  const { deleteTimeLog } = useTimeLogStore();

  const getTaskName = (taskId: string): string => {
    return tasks.find(task => task.id === taskId)?.name || 'Unknown Task';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDuration = (hours: number, minutes: number): string => {
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Time Entries</h3>
      <div className="space-y-4">
        {timeLogs.length === 0 ? (
          <p className="text-gray-500 text-sm">No time entries yet</p>
        ) : (
          timeLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">
                  {getTaskName(log.task_id)}
                </h4>
                <p className="text-sm text-gray-500">
                  {formatDate(log.date)} • {formatDuration(log.hours, log.minutes)}
                </p>
              </div>
              <button
                onClick={() => deleteTimeLog(log.id)}
                className="p-1 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};