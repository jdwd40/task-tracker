import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { TaskModal } from './TaskModal';
import type { Task } from '../../types/task';

export const TaskList: React.FC = () => {
  const { tasks, loading, error, fetchTasks, deleteTask, addTask, updateTask } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (name: string, description: string) => {
    await addTask(name, description);
    setIsModalOpen(false);
  };

  const handleEditTask = async (name: string, description: string) => {
    if (selectedTask) {
      await updateTask(selectedTask.id, name, description);
      setIsModalOpen(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task? All time entries for this task will also be deleted. This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Failed to delete task:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleOpenModal = (task?: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTask(undefined);
    setIsModalOpen(false);
  };

  if (loading || isDeleting) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
        {tasks.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No tasks yet. Create your first task to get started!
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 hover:bg-gray-50 flex items-center justify-between"
            >
              <div>
                <h3 className="text-sm font-medium text-gray-900">{task.name}</h3>
                {task.description && (
                  <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="p-1 text-gray-400 hover:text-gray-500"
                  onClick={() => handleOpenModal(task)}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  className="p-1 text-gray-400 hover:text-red-500"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={selectedTask ? handleEditTask : handleAddTask}
        task={selectedTask}
        title={selectedTask ? 'Edit Task' : 'New Task'}
      />
    </div>
  );
};