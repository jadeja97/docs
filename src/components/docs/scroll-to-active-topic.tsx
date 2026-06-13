"use client";

/* ============================================================================================= */

import { useEffect, startTransition } from "react";

import { jumpScroll } from "@/lib/dom/jump-scroll";

/* ============================================================================================= */

export interface ScrollToActiveTopicProps {
  isMobile?: boolean;
}

export const ScrollToActiveTopic = ({ isMobile = false }: ScrollToActiveTopicProps) => {
  //
  useEffect(() => {
    startTransition(() => {
      //
      const container = document.querySelector(
        `.topics__wrapper--${isMobile ? "mobile" : "desktop"}`,
      );
      const element = container?.querySelector(`[data-active]`);

      jumpScroll({ container, element });
    });
  }, [isMobile]);

  return null;
};
