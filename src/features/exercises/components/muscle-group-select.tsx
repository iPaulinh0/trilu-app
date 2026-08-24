import { MUSCLE_GROUP_LABELS, TRILU_MUSCLE_GROUPS, type TriluMuscleGroup } from "../domain/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MuscleGroupSelectProps {
  value: TriluMuscleGroup | undefined;
  onChange: (value: TriluMuscleGroup) => void;
  placeholder?: string;
  id?: string;
}

export function MuscleGroupSelect({ value, onChange, placeholder = "Escolha um grupo", id }: MuscleGroupSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as TriluMuscleGroup)}>
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {TRILU_MUSCLE_GROUPS.map((group) => (
          <SelectItem key={group} value={group}>
            {MUSCLE_GROUP_LABELS[group]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
