"use client";

/* ============================================================================================= */

import { useEffect, useState } from "react";

import type { ReactNode } from "react";

/* ============================================================================================= */

export interface ClientProps {
  children: ReactNode;
}

/**
 * avoid hidration mismatch with client component
 *
 * @param options - options for client component
 * @param options.children - children
 *
 *   https://github.com/pacocoursey/next-themes?tab=readme-ov-file#avoid-hydration-mismatch
 */
export const Client = ({ children }: ClientProps): ReactNode => {
  //
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // oxlint-disable-next-line react-hooks-js/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return children;
};
