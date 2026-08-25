"use client";

import { useState } from "react";

/**
 * Wraps a question step's onSubmit so "Continuar" can show a spinner and
 * stay disabled the moment a valid answer is submitted — otherwise there's
 * no feedback during the brief gap between the click and the next screen
 * mounting. Never reset back to false on purpose: the component unmounts
 * on successful navigation, and if navigation didn't happen the disabled
 * button is the right state anyway (better than letting a double-submit
 * race the first one).
 */
export function useStepSubmit<T>(onSubmit: (values: T) => void) {
  const [isNavigating, setIsNavigating] = useState(false);

  function handleValidSubmit(values: T) {
    setIsNavigating(true);
    onSubmit(values);
  }

  return { isNavigating, handleValidSubmit };
}
