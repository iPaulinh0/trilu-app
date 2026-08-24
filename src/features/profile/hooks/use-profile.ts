"use client";

import { useEffect, useRef, useState } from "react";
import { profileRepository } from "@/lib/services";
import type { UserProfile } from "../domain/types";

export type ProfileLoadStatus = "loading" | "ready" | "error";

/**
 * Loads the profile and owns the lifecycle of the resolved avatar object URL
 * — created fresh by ProfileRepository.getProfile() on every call, revoked
 * here the moment a newer one replaces it (or on unmount), so nothing keeps
 * piling up in memory across reloads.
 */
export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<ProfileLoadStatus>("loading");
  const previousAvatarUrlRef = useRef<string | null>(null);

  async function load() {
    setStatus("loading");
    try {
      const next = await profileRepository.getProfile();
      if (previousAvatarUrlRef.current && previousAvatarUrlRef.current !== next.avatarUrl) {
        URL.revokeObjectURL(previousAvatarUrlRef.current);
      }
      previousAvatarUrlRef.current = next.avatarUrl;
      setProfile(next);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    return () => {
      if (previousAvatarUrlRef.current) URL.revokeObjectURL(previousAvatarUrlRef.current);
    };
  }, []);

  return { profile, status, reload: load };
}
