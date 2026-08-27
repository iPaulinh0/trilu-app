"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { createWorkoutSchema, type CreateWorkoutFormInput, type CreateWorkoutFormValues } from "@/features/workouts/domain/schema";
import { workoutRepository } from "@/lib/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/shared/field-error";

export default function NovoTreinoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillName = searchParams.get("nome") ?? "";
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWorkoutFormInput, unknown, CreateWorkoutFormValues>({
    resolver: zodResolver(createWorkoutSchema),
    defaultValues: { name: prefillName },
  });

  const submit = handleSubmit(async (values) => {
    setIsSaving(true);
    try {
      const { template } = await workoutRepository.create({ name: values.name, description: null, muscleGroups: [] }, []);
      toast.success("Treino criado!");
      router.push(`/treinos/${template.id}`);
    } catch {
      toast.error("Não foi possível criar o treino agora. Tente novamente.");
      setIsSaving(false);
    }
  });

  return (
    <div className="flex flex-1 flex-col gap-4 py-2">
      <h1 className="text-2xl font-bold text-ink-900">Criar treino</h1>
      <form onSubmit={submit} className="flex flex-1 flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="workout-name">Nome do treino</Label>
          <Input id="workout-name" placeholder="Ex.: Treino A · Peito" autoFocus {...register("name")} />
          <FieldError message={errors.name?.message} />
        </div>

        <Button type="submit" variant="accent" size="lg" block loading={isSaving} className="mt-2">
          Salvar treino
        </Button>
      </form>
    </div>
  );
}
