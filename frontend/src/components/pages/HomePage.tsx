"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Task } from "@/types/api";
import { TaskList } from "@/components/task/TaskList";
import { TaskForm } from "@/components/task/TaskForm";
import { Button, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";

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
    <div className="min-h-screen bg-gradient-to-b from-background to-content1">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-background/60 dark:bg-default-100/50 shadow-medium backdrop-blur-[10px] backdrop-saturate-150">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 pt-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                タスク管理
              </h1>
              <p className="mt-2 text-foreground-500">
                効率的なタスク管理で生産性を向上させましょう
              </p>
            </div>
            <Button
              color="primary"
              variant="shadow"
              onPress={() => setIsFormOpen(true)}
              size="lg"
              startContent={<PlusIcon />}
              className="bg-gradient-to-r from-primary to-secondary w-full sm:w-auto"
            >
              新規タスク
            </Button>
          </CardHeader>

          <CardBody className="px-6 py-4">
            {isFormOpen && (
              <>
                <Divider className="my-6" />
                <div className="mb-6">
                  <h2 className="mb-4 text-2xl font-bold text-foreground">
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
                <Divider className="my-6" />
              </>
            )}

            <TaskList
              tasks={tasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReorder={handleReorder}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
