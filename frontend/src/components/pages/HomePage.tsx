"use client";

import { ThemeToggle } from "@/components/common/ThemeToggle";
import { TaskForm } from "@/components/task/TaskForm";
import { TaskList } from "@/components/task/TaskList";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { Task } from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import type { ReactElement } from "react";
import { useState } from "react";

type FormData = {
  title: string;
  description?: string;
  statusId: number;
  dueDate?: string;
  tagIds?: number[];
};

export function HomePage(): ReactElement {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const queryClient = useQueryClient();

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: api.getTasks,
  });

  const { data: statuses = [] } = useQuery({
    queryKey: ["taskStatuses"],
    queryFn: api.getTaskStatuses,
  });

  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: api.getTags,
  });

  const createTaskMutation = useMutation({
    mutationFn: api.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsFormOpen(false);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: api.updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setSelectedTask(undefined);
      setIsFormOpen(false);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: api.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const reorderTasksMutation = useMutation({
    mutationFn: api.reorderTasks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleSubmit = async (data: FormData): Promise<void> => {
    if (selectedTask) {
      await updateTaskMutation.mutateAsync({
        id: selectedTask.id,
        ...data,
      });
    } else {
      await createTaskMutation.mutateAsync({
        ...data,
        position: tasks.length,
      });
    }
  };

  const handleEdit = (task: Task): void => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleDelete = async (taskId: number): Promise<void> => {
    if (confirm("このタスクを削除してもよろしいですか？")) {
      await deleteTaskMutation.mutateAsync(taskId);
    }
  };

  const handleReorder = async (taskIds: number[]): Promise<void> => {
    await reorderTasksMutation.mutateAsync(taskIds);
  };

  const handleCancel = (): void => {
    setSelectedTask(undefined);
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border bg-card p-6 shadow-lg backdrop-blur-[10px]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent dark:from-blue-400 dark:to-purple-400 sm:text-4xl">
                  タスク管理
                </h1>
                <p className="mt-2 font-medium text-muted-foreground">
                  効率的なタスク管理で生産性を向上させましょう
                </p>
              </div>
              <ThemeToggle />
            </div>
            <Button
              size="lg"
              onClick={() => setIsFormOpen(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 font-semibold text-white transition-all duration-200 hover:opacity-90 dark:from-blue-500 dark:to-purple-500 sm:w-auto"
            >
              <Plus className="mr-2 h-5 w-5" />
              新規タスク
            </Button>
          </div>

          <div className="px-0 py-4">
            {isFormOpen && (
              <>
                <div className="my-6 h-px bg-border opacity-50" />
                <div className="mb-6">
                  <h2 className="mb-4 text-2xl font-bold text-foreground/90">
                    {selectedTask ? "タスクの編集" : "新規タスク"}
                  </h2>
                  <TaskForm
                    task={selectedTask}
                    statuses={statuses}
                    tags={tags}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isSubmitting={
                      createTaskMutation.isPending ||
                      updateTaskMutation.isPending
                    }
                  />
                </div>
                <div className="my-6 h-px bg-border opacity-50" />
              </>
            )}

            <TaskList
              tasks={tasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReorder={handleReorder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
