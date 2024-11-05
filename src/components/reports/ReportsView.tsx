import React, { useEffect, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { DailyChart } from './charts/DailyChart';
import { TaskDistributionChart } from './charts/TaskDistributionChart';
import { WeeklyChart } from './charts/WeeklyChart';
import { useTimeLogStore } from '../../store/timeLogStore';
import { useTaskStore } from '../../store/taskStore';
import { StatsCard } from './StatsCard';

export const ReportsView: React.FC = () => {
  const { timeLogs, fetchTimeLogs } = useTimeLogStore();
  const { tasks, fetchTasks } = useTaskStore();
  const [totalHours, setTotalHours] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [avgDailyHours, setAvgDailyHours] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchTimeLogs(), fetchTasks()]);
    };
    loadData();
  }, [fetchTimeLogs, fetchTasks]);

  useEffect(() => {
    // Calculate total hours
    const total = timeLogs.reduce((acc, log) => acc + log.hours + log.minutes / 60, 0);
    setTotalHours(Math.round(total * 10) / 10);

    // Calculate total active tasks
    setTotalTasks(tasks.length);

    // Calculate average daily hours
    const dates = [...new Set(timeLogs.map(log => log.date.split('T')[0]))];
    const avg = total / (dates.length || 1);
    setAvgDailyHours(Math.round(avg * 10) / 10);
  }, [timeLogs, tasks]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Hours Tracked"
          value={`${totalHours}h`}
          icon={Clock}
          trend={totalHours > 0 ? 'up' : 'neutral'}
        />
        <StatsCard
          title="Active Tasks"
          value={totalTasks.toString()}
          icon={Calendar}
          trend={totalTasks > 0 ? 'up' : 'neutral'}
        />
        <StatsCard
          title="Avg. Daily Hours"
          value={`${avgDailyHours}h`}
          icon={Clock}
          trend={avgDailyHours > 0 ? 'up' : 'neutral'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Activity</h3>
          <DailyChart timeLogs={timeLogs} />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Task Distribution</h3>
          <TaskDistributionChart timeLogs={timeLogs} tasks={tasks} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Overview</h3>
        <WeeklyChart timeLogs={timeLogs} />
      </div>
    </div>
  );
};