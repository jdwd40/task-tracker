import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { TimeLog } from '../../../types/task';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface WeeklyChartProps {
  timeLogs: TimeLog[];
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ timeLogs }) => {
  // Get the last 4 weeks starting from the most recent Sunday
  const getWeekRanges = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    const daysToLastSunday = currentDay === 0 ? 0 : currentDay;
    
    const lastSunday = new Date(today);
    lastSunday.setDate(today.getDate() - daysToLastSunday);
    lastSunday.setHours(0, 0, 0, 0);

    return Array.from({ length: 4 }, (_, i) => {
      const weekStart = new Date(lastSunday);
      weekStart.setDate(lastSunday.getDate() - (i * 7));
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      return {
        start: weekStart,
        end: weekEnd,
        label: `Week of ${weekStart.toLocaleDateString('en-US', { 
          month: 'short',
          day: 'numeric'
        })}`,
      };
    }).reverse();
  };

  const weekRanges = getWeekRanges();

  const weeklyHours = weekRanges.map(({ start, end }) => {
    const logsInWeek = timeLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= start && logDate <= end;
    });

    return logsInWeek.reduce((total, log) => total + log.hours + (log.minutes / 60), 0);
  });

  const data = {
    labels: weekRanges.map(week => week.label),
    datasets: [
      {
        label: 'Hours',
        data: weeklyHours,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const hours = Math.floor(context.raw);
            const minutes = Math.round((context.raw - hours) * 60);
            return `${hours}h ${minutes}m`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours',
        },
        ticks: {
          callback: (value: number) => `${value}h`,
        },
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Line data={data} options={options} />
    </div>
  );
};