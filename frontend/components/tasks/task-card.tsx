import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatDateOnly } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date | string;
  userId: string;
  dueDate?: Date | string | null;
}

interface TaskCardProps {
  task: Task;
  onToggleComplete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) => {
  const handleToggleComplete = () => {
    onToggleComplete?.(task.id);
  };

  const handleEdit = () => {
    onEdit?.(task.id);
  };

  const handleDelete = () => {
    onDelete?.(task.id);
  };

  return (
    <Card className={`transition-all duration-200 ${task.completed ? 'bg-secondary/20' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggleComplete}
            className="mt-1 h-5 w-5 rounded border-input bg-transparent focus:ring-0 focus:ring-offset-0"
            aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={`font-medium truncate ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {task.title}
              </h3>
              {task.completed && (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                  Completed
                </span>
              )}
            </div>

            {task.description && (
              <p className="mt-1 text-sm text-muted-foreground truncate">
                {task.description}
              </p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                Created: {formatDateOnly(task.createdAt)}
              </span>
              {task.dueDate && (
                <span className="inline-flex items-center rounded-full bg-secondary/10 px-2 py-1 text-xs font-medium text-secondary-foreground">
                  Due: {formatDateOnly(task.dueDate)}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-1">
            <button
              onClick={handleEdit}
              className="p-1.5 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`Edit task "${task.title}"`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>

            <button
              onClick={handleDelete}
              className="p-1.5 rounded-full hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
              aria-label={`Delete task "${task.title}"`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};