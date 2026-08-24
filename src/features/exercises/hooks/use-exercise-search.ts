"use client";

import { useEffect, useRef, useState } from "react";
import { exerciseCatalogProvider } from "@/lib/services";
import { ExerciseCatalogError } from "../domain/errors";
import { EXERCISE_SEARCH_DEBOUNCE_MS, EXERCISE_SEARCH_MIN_LENGTH } from "../domain/types";
import type { ExerciseCatalogItem, ExerciseSearchFilters, TriluMuscleGroup } from "../domain/types";

export type ExerciseSearchStatus = "idle" | "loading" | "loadingMore" | "error" | "ready";

export function useExerciseSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [muscleGroup, setMuscleGroup] = useState<TriluMuscleGroup | undefined>(undefined);
  const [items, setItems] = useState<ExerciseCatalogItem[]>([]);
  const [status, setStatus] = useState<ExerciseSearchStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), EXERCISE_SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    const hasQuery = trimmed.length >= EXERCISE_SEARCH_MIN_LENGTH;
    if (!hasQuery && !muscleGroup) {
      abortRef.current?.abort();
      // Resetting to the empty/idle state when the query and filter are both
      // cleared — a deliberate derived-state reset, not a data fetch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems([]);
      setStatus("idle");
      setNextCursor(null);
      setHasMore(false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus("loading");
    setErrorMessage(null);

    const filters: ExerciseSearchFilters = { muscleGroup };
    exerciseCatalogProvider
      .search(trimmed, filters, null, controller.signal)
      .then((page) => {
        if (controller.signal.aborted) return;
        setItems(page.items);
        setNextCursor(page.nextCursor);
        setHasMore(page.hasMore);
        setStatus("ready");
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setStatus("error");
        setErrorMessage(error instanceof ExerciseCatalogError ? error.message : "Não foi possível buscar exercícios.");
      });

    return () => controller.abort();
  }, [debouncedQuery, muscleGroup]);

  async function loadMore() {
    if (!hasMore || !nextCursor || status === "loadingMore") return;
    setStatus("loadingMore");
    try {
      const trimmed = debouncedQuery.trim();
      const page = await exerciseCatalogProvider.search(trimmed, { muscleGroup }, nextCursor);
      setItems((prev) => {
        const seen = new Set(prev.map((i) => `${i.provider}:${i.providerId}`));
        const additions = page.items.filter((i) => !seen.has(`${i.provider}:${i.providerId}`));
        return [...prev, ...additions];
      });
      setNextCursor(page.nextCursor);
      setHasMore(page.hasMore);
      setStatus("ready");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof ExerciseCatalogError ? error.message : "Não foi possível buscar exercícios.");
    }
  }

  function retry() {
    // Re-triggers the effect by nudging debouncedQuery via a no-op state set won't work (same value) —
    // simplest correct retry is to re-run the same search directly.
    const trimmed = debouncedQuery.trim();
    const hasQuery = trimmed.length >= EXERCISE_SEARCH_MIN_LENGTH;
    if (!hasQuery && !muscleGroup) return;
    setStatus("loading");
    setErrorMessage(null);
    exerciseCatalogProvider
      .search(trimmed, { muscleGroup }, null)
      .then((page) => {
        setItems(page.items);
        setNextCursor(page.nextCursor);
        setHasMore(page.hasMore);
        setStatus("ready");
      })
      .catch((error) => {
        setStatus("error");
        setErrorMessage(error instanceof ExerciseCatalogError ? error.message : "Não foi possível buscar exercícios.");
      });
  }

  return {
    query,
    setQuery,
    muscleGroup,
    setMuscleGroup,
    items,
    status,
    errorMessage,
    hasMore,
    loadMore,
    retry,
  };
}
