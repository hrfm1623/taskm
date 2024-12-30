import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import type { ReactElement } from "react";
import type { Task } from "@/types/api";
import { Card, CardBody, Button, Chip } from "@nextui-org/react";

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
    <Card
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? "opacity-50" : ""} w-full`}
      {...attributes}
      {...listeners}
    >
      <CardBody className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <div className="flex gap-2 shrink-0">
            <Button
              size="sm"
              variant="light"
              color="primary"
              onPress={() => onEdit(task)}
            >
              編集
            </Button>
            <Button
              size="sm"
              variant="light"
              color="danger"
              onPress={() => onDelete(task.id)}
            >
              削除
            </Button>
          </div>
        </div>

        {task.description && (
          <p className="mt-2 text-sm text-foreground-500">{task.description}</p>
        )}

        <div className="mt-4 flex flex-col gap-3">
          <Chip
            size="sm"
            className="shrink-0 w-fit"
            style={{ backgroundColor: task.status.color, color: "#fff" }}
          >
            {task.status.name}
          </Chip>

          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag) => (
                <Chip
                  key={tag.id}
                  size="sm"
                  className="shrink-0"
                  style={{ backgroundColor: tag.color, color: "#fff" }}
                >
                  {tag.name}
                </Chip>
              ))}
            </div>
          )}

          {task.dueDate && (
            <div className="text-sm text-foreground-500">
              期限:{" "}
              {format(new Date(task.dueDate), "yyyy/MM/dd", { locale: ja })}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
