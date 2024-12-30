import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import type { ReactElement } from "react";
import type { Task } from "@/types/api";

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
      className={`card bg-base-100 shadow-md ${isDragging ? "opacity-50" : ""}`}
      {...attributes}
      {...listeners}
    >
      <div className="card-body p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="card-title text-lg">{task.title}</h3>
          <div className="flex gap-2">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => onEdit(task)}
            >
              編集
            </button>
            <button
              className="btn btn-ghost btn-sm text-error"
              onClick={() => onDelete(task.id)}
            >
              削除
            </button>
          </div>
        </div>

        {task.description && (
          <p className="mt-2 text-sm text-base-content/70">
            {task.description}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <div
            className="badge"
            style={{ backgroundColor: task.status.color, color: "#fff" }}
          >
            {task.status.name}
          </div>
          {task.tags.map((tag) => (
            <div
              key={tag.id}
              className="badge"
              style={{ backgroundColor: tag.color, color: "#fff" }}
            >
              {tag.name}
            </div>
          ))}
        </div>

        {task.dueDate && (
          <div className="mt-2 text-sm text-base-content/70">
            期限: {format(new Date(task.dueDate), "yyyy/MM/dd", { locale: ja })}
          </div>
        )}
      </div>
    </div>
  );
}
