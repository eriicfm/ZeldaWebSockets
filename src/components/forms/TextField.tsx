import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useId } from "react";

interface FieldProps {
  label: string;
  type: string;
  value: string | number;
  placeholder: string;
  required: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export default function Field({
  label,
  type,
  value,
  placeholder,
  required,
  onChange,
}: FieldProps) {
  const id = useId();
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        id={id}
        placeholder={placeholder}
        type={type}
        value={value}
        required={required}
        onChange={onChange}
      />
    </div>
  );
}
