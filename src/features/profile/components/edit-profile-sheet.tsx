"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileFormSchema, type ProfileFormValues } from "../domain/schema";
import { useMediaQuery } from "@/lib/use-media-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/shared/field-error";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface EditProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: ProfileFormValues;
  onSubmit: (values: ProfileFormValues) => Promise<void>;
}

export function EditProfileSheet({ open, onOpenChange, initialValues, onSubmit }: EditProfileSheetProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (open) reset(initialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
      onOpenChange(false);
    } catch {
      // onSubmit already surfaced its own toast — keep the form open with
      // whatever the person typed so they can fix it and retry.
    }
  });

  const title = "Editar perfil";
  const description = "A foto pode ser alterada diretamente pelo avatar, na tela anterior.";

  const formBody = (
    <form id="edit-profile-form" onSubmit={submit} className="flex flex-col gap-4 px-4 pb-2 sm:px-0">
      <div className="flex flex-col gap-2">
        <Label htmlFor="profile-name">Nome</Label>
        <Input
          id="profile-name"
          placeholder="Seu nome"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "profile-name-error" : undefined}
          {...register("name")}
        />
        <FieldError id="profile-name-error" message={errors.name?.message} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="profile-email">E-mail</Label>
        <Input
          id="profile-email"
          type="email"
          placeholder="voce@exemplo.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "profile-email-error" : undefined}
          {...register("email")}
        />
        <FieldError id="profile-email-error" message={errors.email?.message} />
      </div>
    </form>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {formBody}
          <DialogFooter>
            <Button type="submit" form="edit-profile-form" variant="accent" block loading={isSubmitting}>
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto">{formBody}</div>
        <DrawerFooter>
          <Button type="submit" form="edit-profile-form" variant="accent" size="lg" block loading={isSubmitting}>
            Salvar alterações
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
