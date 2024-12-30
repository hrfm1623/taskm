import type { ReactElement } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  ButtonGroup,
  Divider,
} from "@nextui-org/react";
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
      {...attributes}
      {...listeners}
      className={`transition-all duration-200 ${isDragging ? "z-50 scale-105" : ""}`}
    >
      <Card
        className={`
          border-none 
          bg-background/60 dark:bg-default-100/20 
          backdrop-blur-sm backdrop-saturate-150
          hover:shadow-lg hover:scale-[1.02]
          transition-all duration-200
        `}
        shadow="sm"
      >
        <CardHeader className="flex justify-between px-6 pt-6">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{task.title}</h3>
            {task.dueDate && (
              <p className="text-xs text-default-500">
                期限: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            )}
          </div>
          <ButtonGroup size="sm" className="gap-1">
            <Button
              color="primary"
              variant="flat"
              onPress={() => onEdit(task)}
              className="bg-primary/10 hover:bg-primary/20"
            >
              編集
            </Button>
            <Button
              color="danger"
              variant="flat"
              onPress={() => onDelete(task.id)}
              className="bg-danger/10 hover:bg-danger/20"
            >
              削除
            </Button>
          </ButtonGroup>
        </CardHeader>

        <Divider className="my-3" />

        <CardBody className="space-y-4 px-6 pb-6">
          {task.description && (
            <p className="text-sm text-default-600">{task.description}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {task.status && (
              <Chip
                color={task.status.name === "完了" ? "success" : "primary"}
                variant="flat"
                size="sm"
                classNames={{
                  base: "bg-opacity-20",
                  content: "font-medium",
                }}
              >
                {task.status.name}
              </Chip>
            )}
            {task.tags?.map((tag) => (
              <Chip
                key={tag.id}
                variant="flat"
                size="sm"
                classNames={{
                  base: `bg-opacity-15 transition-colors`,
                  content: "font-medium",
                }}
                style={{
                  backgroundColor: `${tag.color}20`,
                  color: tag.color,
                }}
              >
                {tag.name}
              </Chip>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
