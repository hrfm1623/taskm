import { Input, Select, Textarea, SelectItem } from "@nextui-org/react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

const baseFieldProps = {
  labelPlacement: "outside" as const,
  variant: "bordered" as const,
  radius: "sm" as const,
};

type FormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  isRequired?: boolean;
  type?: "text" | "date" | "select" | "textarea";
  options?: { id: number; name: string }[];
  minRows?: number;
};

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  isRequired,
  type = "text",
  options,
  minRows,
}: FormFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        switch (type) {
          case "select":
            return (
              <Select
                {...baseFieldProps}
                label={label}
                selectedKeys={[String(field.value)]}
                onChange={(e) => field.onChange(Number(e.target.value))}
                errorMessage={error?.message}
                isRequired={isRequired}
              >
                {options?.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                )) ?? []}
              </Select>
            );
          case "textarea":
            return (
              <Textarea
                {...baseFieldProps}
                {...field}
                label={label}
                minRows={minRows}
                errorMessage={error?.message}
                isRequired={isRequired}
              />
            );
          case "date":
          case "text":
          default:
            return (
              <Input
                {...baseFieldProps}
                {...field}
                type={type}
                label={label}
                errorMessage={error?.message}
                isRequired={isRequired}
              />
            );
        }
      }}
    />
  );
}
