import { startTransition, useRef, useEffect, useState } from "react";

/* ============================================================================================= */

export interface ScrollSpyOptions {
  tocIds: string[];
  scrollContainer: string;
  offset: number;
}

export const useScrollSpy = ({ tocIds, scrollContainer, offset }: ScrollSpyOptions) => {
  //
  const observer = useRef<IntersectionObserver>(null);

  const [activeIds, setActiveIds] = useState<string[]>([]);

  // when the `useScollSpy` is ran for the first time,
  // TOC dom is not built. Need a manual initialization.
  // explored the `mutationObserver`, but this is the simplest way.
  const [start, setStart] = useState(false);

  // handle active ids
  const handleActiveIds: IntersectionObserverCallback = (entries) => {
    startTransition(() => {
      setActiveIds((prev) => {
        //
        const newIds = [...prev];
        let hasChanged = false;

        for (const entry of entries) {
          if (entry.isIntersecting && !newIds.includes(entry.target.id)) {
            newIds.push(entry.target.id);
            hasChanged = true;
          } else if (!entry.isIntersecting && newIds.includes(entry.target.id)) {
            const index = newIds.indexOf(entry.target.id);
            newIds.splice(index, 1);
            hasChanged = true;
          }
        }

        return hasChanged ? newIds : prev;
      });
    });
  };

  // initalize the observer
  const initObserver = (container: Element) => {
    //
    const elements = tocIds
      // if using `#${id}` to query, and `id` starts with number, it will throw error
      // using `id` as attribute to prevent issue
      .map((id) => {
        return container.querySelector(`[id="${id}"]`);
      })
      .filter((x) => {
        return x !== null;
      });

    if (elements.length === 0) {
      return;
    }

    observer.current = new IntersectionObserver(handleActiveIds, {
      // scroll container
      root: container,
      // margin for observer (top right bottom left)
      rootMargin: `-${offset || 0}px 0px 0px 0px`,
      // visible part of the element to detect intersection
      threshold: 0.1,
    });

    for (const el of elements) {
      observer.current?.observe(el);
    }
  };

  // remove the observer instance
  const disconnect = () => {
    observer.current?.disconnect();
    observer.current = null;
  };

  // handle observer instance in-relation to component life-cycle
  useEffect(() => {
    // remove the previous instance
    disconnect();

    // start the observation only if dom is ready
    if (start) {
      const container = document.querySelector(scrollContainer);

      if (container && tocIds.length > 0) {
        initObserver(container);
      }
    }

    return () => {
      disconnect();
    };
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [start, tocIds, scrollContainer, offset]);

  return {
    activeIds,
    initialize: () => {
      setStart(true);
    },
  };
};
