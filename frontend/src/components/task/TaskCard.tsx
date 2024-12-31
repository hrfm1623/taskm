import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/api";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import type { ReactElement } from "react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
}: TaskCardProps): ReactElement {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "w-full rounded-lg border bg-card text-card-foreground shadow-sm",
        isDragging && "opacity-50"
      )}
      {...attributes}
      {...listeners}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <div className="flex shrink-0 gap-2">
            <Button size="sm" variant="ghost" onClick={() => onEdit(task)}>
              編集
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(task.id)}
            >
              削除
            </Button>
          </div>
        </div>

        {task.description && (
          <p className="mt-2 text-sm text-muted-foreground">
            {task.description}
          </p>
        )}

        <div className="mt-4 flex flex-col gap-3">
          <span
            className="inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: task.status.color, color: "#fff" }}
          >
            {task.status.name}
          </span>

          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{ backgroundColor: tag.color, color: "#fff" }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {task.dueDate && (
            <div className="text-sm text-muted-foreground">
              期限:{" "}
              {format(new Date(task.dueDate), "yyyy/MM/dd", { locale: ja })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
