import { FormField } from "@/components/common/FormField";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { Tag, Task, TaskStatus } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

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
    control,
    handleSubmit,
    reset,
    formState: {},
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <FormField
            control={control}
            name="title"
            label="タイトル"
            isRequired
          />

          <FormField
            control={control}
            name="description"
            label="説明"
            type="textarea"
            minRows={5}
          />
        </div>

        <div className="space-y-6">
          <FormField
            control={control}
            name="statusId"
            label="ステータス"
            type="select"
            options={statuses}
          />

          <FormField
            control={control}
            name="dueDate"
            label="期限"
            type="date"
          />

          <div className="space-y-3">
            <p className="text-sm font-medium">タグ</p>
            <Card className="p-4">
              <Controller
                name="tagIds"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <div className="flex flex-col gap-2">
                    {tags.map((tag) => (
                      <div key={tag.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag.id}`}
                          checked={value?.includes(tag.id)}
                          onCheckedChange={(checked) => {
                            const newValue = checked
                              ? [...(value ?? []), tag.id]
                              : (value ?? []).filter((id) => id !== tag.id);
                            onChange(newValue);
                          }}
                        />
                        <label
                          htmlFor={`tag-${tag.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {tag.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              />
            </Card>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="text-destructive hover:bg-destructive/10"
        >
          キャンセル
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {task ? "更新" : "作成"}
        </Button>
      </div>
    </form>
  );
}
