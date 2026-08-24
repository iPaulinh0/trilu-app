"use client";

import { useRouter } from "next/navigation";
import { LogOutIcon } from "lucide-react";
import { Mascot } from "@/components/shared/mascot";
import { Button } from "@/components/ui/button";
import { authSessionStorage } from "@/lib/services";
import { invalidateCurrentUserCache, useCurrentUser } from "@/features/auth/hooks/use-current-user";

export default function PerfilPage() {
  const router = useRouter();
  const { user } = useCurrentUser();

  function handleLogout() {
    authSessionStorage.clear();
    invalidateCurrentUserCache();
    router.push("/login");
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-4 py-8 text-center">
      <Mascot size={120} />
      <div>
        <h1 className="text-xl font-bold text-ink-900">{user?.name ?? "Sua conta"}</h1>
        {user?.email ? <p className="text-sm text-ink-500">{user.email}</p> : null}
      </div>
      <p className="max-w-xs text-sm leading-relaxed text-ink-500">
        Estatísticas completas, ajustes e conquistas chegam em breve por aqui.
      </p>
      <Button type="button" variant="outline" onClick={handleLogout} className="mt-4">
        <LogOutIcon className="size-4" aria-hidden />
        Sair
      </Button>
    </div>
  );
}
