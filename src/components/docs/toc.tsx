"use client";

/* ============================================================================================= */

import { startTransition, useEffect, Fragment } from "react";

import { Link } from "@/components/link";
import { List } from "@/components/list";
import { SheetClose } from "@/components/sheet";
import { useScrollSpy } from "@/hooks/scroll-spy";
import { useGetTopOffset } from "@/hooks/top-offset";
import { jumpScroll } from "@/lib/dom/jump-scroll";

import type { ReactElement } from "react";

import type { TOC as TOCType } from "@/types/content";

/* ============================================================================================= */

export interface TOCProps {
  toc: TOCType[];
  isMobile?: boolean;
}

export const TOC = ({ toc, isMobile = false }: TOCProps): ReactElement<HTMLDivElement> => {
  //
  const Wrapper = isMobile ? SheetClose : Fragment;

  const topOffset = useGetTopOffset();

  const { activeIds = [], initialize } = useScrollSpy({
    tocIds: toc.map((item) => {
      return item.id;
    }),
    scrollContainer: "body",
    offset: topOffset,
  });

  // initialize the scroll spy
  useEffect(() => {
    // when the `useScollSpy` is ran for the first time,
    // TOC dom is not built. Need a manual initialization.
    // explored the `mutationObserver`, but this is the simplest way.
    initialize();

    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // scroll TOC container to make active links visible (if offscreen)
  useEffect(() => {
    if (activeIds.length > 0) {
      startTransition(() => {
        //
        const container = document.querySelector(
          `.toc__wrapper--${isMobile ? "mobile" : "desktop"}`,
        );

        const activeElements = container?.querySelectorAll(`[data-active]`);
        const lastElement = activeElements ? [...activeElements]?.at(-1) : null;

        jumpScroll({
          container,
          element: lastElement,
        });
      });
    }
  }, [activeIds, isMobile]);

  return (
    <div className="toc">
      {/*  */}
      {!isMobile && <span className="toc__label">On This Page</span>}

      <List unstyled>
        {toc.map((item) => {
          return (
            <li key={item.id} data-level={item.level > 2 ? item.level : undefined}>
              <Wrapper {...(isMobile ? { isWrapper: true, hideFocus: true } : {})}>
                <Link
                  href={`#${item.id}`}
                  data-active={activeIds.includes(item.id) ? true : undefined}
                >
                  {item.text}
                </Link>
              </Wrapper>
            </li>
          );
        })}
      </List>
    </div>
  );
};
