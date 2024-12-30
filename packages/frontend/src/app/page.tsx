"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Task } from "@/types/api";
import { TaskList } from "@/components/task/TaskList";
import { TaskForm } from "@/components/task/TaskForm";
import { Button } from "@/components/ui/Button";

type FormData = {
  title: string;
  description?: string;
  statusId: number;
  dueDate?: string;
  tagIds?: number[];
};

export default function Home(): ReactElement {
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
    <div className="container mx-auto p-4">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">タスク管理</h1>
        <Button onClick={() => setIsFormOpen(true)}>新規タスク</Button>
      </div>

      {isFormOpen ? (
        <div className="mb-8 rounded-lg bg-base-200 p-4">
          <h2 className="mb-4 text-xl font-bold">
            {selectedTask ? "タスクの編集" : "新規タスク"}
          </h2>
          <TaskForm
            task={selectedTask}
            statuses={statuses}
            tags={tags}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={
              createTaskMutation.isPending || updateTaskMutation.isPending
            }
          />
        </div>
      ) : null}

      <TaskList
        tasks={tasks}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReorder={handleReorder}
      />
    </div>
  );
}
