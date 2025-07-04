import { Label } from "@/components/ui/label";
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import { useId } from "react";

interface MultiselectProps {
  label: string;
  options: Option[];
  placeholder: string;
  value?: Option[]; // Añadir prop para el valor seleccionado
  onChange: (value: Option[]) => void;
}

export default function Multiselect({
  label,
  options,
  placeholder,
  value = [], // Valor por defecto es un array vacío
  onChange,
}: MultiselectProps): JSX.Element {
  const id = useId();
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>{label}</Label>
      <MultipleSelector
        value={value} // Usar el valor proporcionado en lugar de options.slice(0, 0)
        placeholder={placeholder}
        defaultOptions={options}
        hideClearAllButton
        hidePlaceholderWhenSelected
        className="bg-white"
        emptyIndicator={<p className="text-center text-sm">No results found</p>}
        onChange={onChange}
      />
    </div>
  );
}
