import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Tag, Task, TaskStatus } from "@/types/api";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const schema = z.object({
  title: z.string().min(1, "必須項目です"),
  description: z.string().optional(),
  statusId: z.number(),
  dueDate: z.string().optional(),
  tagIds: z.array(z.number()).optional(),
});

type FormData = z.infer<typeof schema>;

interface TaskFormProps {
  task?: Task;
  statuses: TaskStatus[];
  tags: Tag[];
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TaskForm({
  task,
  statuses,
  tags,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      statusId: task?.statusId ?? statuses[0]?.id,
      dueDate: task?.dueDate?.split("T")[0] ?? "",
      tagIds: task?.tags.map((tag) => tag.id) ?? [],
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description ?? "",
        statusId: task.statusId,
        dueDate: task.dueDate?.split("T")[0] ?? "",
        tagIds: task.tags.map((tag) => tag.id),
      });
    }
  }, [task, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="タイトル"
        error={errors.title?.message}
        {...register("title")}
      />

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">説明</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-24"
          {...register("description")}
        />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">ステータス</span>
        </label>
        <select
          className="select select-bordered"
          {...register("statusId", { valueAsNumber: true })}
        >
          {statuses.map((status) => (
            <option key={status.id} value={status.id}>
              {status.name}
            </option>
          ))}
        </select>
      </div>

      <Input
        type="date"
        label="期限"
        error={errors.dueDate?.message}
        {...register("dueDate")}
      />

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">タグ</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <label key={tag.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={tag.id}
                className="checkbox"
                {...register("tagIds", { valueAsNumber: true })}
              />
              <span
                className="badge"
                style={{ backgroundColor: tag.color, color: "#fff" }}
              >
                {tag.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          キャンセル
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {task ? "更新" : "作成"}
        </Button>
      </div>
    </form>
  );
}
