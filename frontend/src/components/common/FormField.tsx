import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { motion } from "framer-motion";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

type FormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  isRequired?: boolean;
  type?: "text" | "date" | "select" | "textarea";
  options?: { id: number; name: string }[];
  minRows?: number;
  className?: string;
};

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  isRequired,
  type = "text",
  options,
  minRows,
  className,
}: FormFieldProps<T>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn("space-y-2", className)}
    >
      <Label
        htmlFor={name}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
        {isRequired && <span className="text-destructive">*</span>}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
          switch (type) {
            case "select":
              return (
                <Select
                  value={String(field.value)}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder=" " />
                  </SelectTrigger>
                  <SelectContent>
                    {options?.map((option) => (
                      <SelectItem
                        key={option.id}
                        value={String(option.id)}
                        className="cursor-pointer"
                      >
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            case "textarea":
              return (
                <Textarea
                  {...field}
                  id={name}
                  placeholder=" "
                  rows={minRows}
                  className={cn(
                    "min-h-[80px] resize-none",
                    error && "border-destructive"
                  )}
                />
              );
            case "date":
            case "text":
            default:
              return (
                <Input
                  {...field}
                  id={name}
                  type={type}
                  placeholder=" "
                  className={cn(error && "border-destructive")}
                />
              );
          }
        }}
      />
    </motion.div>
  );
}
