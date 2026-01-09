'use client';

import React, { useState, useEffect } from 'react';
import { TaskCard } from '@/components/tasks/task-card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Task } from '@/types/task';
import { taskService } from '@/services/task-service';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await taskService.getTasks();
        setTasks(tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleToggleComplete = async (id: string) => {
    try {
      const updatedTask = await taskService.toggleTaskCompletion(id);
      setTasks(tasks.map(task =>
        task.id === id ? updatedTask : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleEditTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setCurrentTask(task);
      setShowTaskModal(true);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(id);
        setTasks(tasks.filter(task => task.id !== id));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleAddNewTask = () => {
    setCurrentTask(null);
    setShowTaskModal(true);
  };

  const handleModalClose = () => {
    setShowTaskModal(false);
    setCurrentTask(null);
  };

  const handleSaveTask = async () => {
    const titleInput = document.getElementById('task-title') as HTMLInputElement;
    const descriptionTextarea = document.getElementById('task-description') as HTMLTextAreaElement;

    if (!titleInput?.value.trim()) {
      alert('Title is required');
      return;
    }

    const formData = {
      title: titleInput.value,
      description: descriptionTextarea?.value || '',
      completed: currentTask?.completed || false,
    };

    try {
      if (currentTask) {
        // Update existing task
        const updatedTask = await taskService.updateTask(currentTask.id, formData);
        setTasks(tasks.map(task => task.id === currentTask.id ? updatedTask : task));
      } else {
        // Create new task
        const newTask = await taskService.createTask(formData);
        setTasks([...tasks, newTask]);
      }

      setShowTaskModal(false);
      setCurrentTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Failed to save task. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button onClick={handleAddNewTask}>
          Add New Task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-medium mb-1">No tasks yet</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first task
          </p>
          <Button onClick={handleAddNewTask}>
            Create Task
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={showTaskModal}
        onClose={handleModalClose}
        title={currentTask ? 'Edit Task' : 'Create New Task'}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="task-title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              id="task-title"
              className="w-full px-3 py-2 border rounded-md"
              defaultValue={currentTask?.title || ''}
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label htmlFor="task-description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="task-description"
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
              defaultValue={currentTask?.description || ''}
              placeholder="Enter task description (optional)"
            ></textarea>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button onClick={handleSaveTask}>
              {currentTask ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}