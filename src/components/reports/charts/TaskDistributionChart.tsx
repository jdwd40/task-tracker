import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import type { TimeLog, Task } from '../../../types/task';

ChartJS.register(ArcElement, Tooltip, Legend);

interface TaskDistributionChartProps {
  timeLogs: TimeLog[];
  tasks: Task[];
}

export const TaskDistributionChart: React.FC<TaskDistributionChartProps> = ({ timeLogs, tasks }) => {
  const taskHours = tasks.map(task => {
    const taskLogs = timeLogs.filter(log => log.task_id === task.id);
    return taskLogs.reduce((acc, log) => acc + log.hours + log.minutes / 60, 0);
  });

  const data = {
    labels: tasks.map(task => task.name),
    datasets: [
      {
        data: taskHours,
        backgroundColor: [
          'rgba(99, 102, 241, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(245, 158, 11, 0.5)',
          'rgba(239, 68, 68, 0.5)',
          'rgba(139, 92, 246, 0.5)',
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Pie data={data} options={options} />
    </div>
  );
};