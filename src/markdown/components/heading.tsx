"use client";

import { usePathname, useRouter } from "next/navigation.js";

import type { ComponentProps, JSX, KeyboardEvent, ReactElement } from "react";

/* ============================================================================================= */

export type HeadingTag = keyof Pick<JSX.IntrinsicElements, "h1" | "h2" | "h3" | "h4" | "h5" | "h6">;

export type HeadingsProps = ComponentProps<HeadingTag> & {
  as: HeadingTag;
};

export const Headings = ({
  as: Component,
  ...rest
}: HeadingsProps): ReactElement<HTMLHeadingElement> => {
  //
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = () => {
    //
    if (!rest.id) {
      return;
    }

    // new page navigation must start from top (scroll position `0`)
    // pathname contains the trailing slash (if exists)
    router.push(`${pathname}#${rest.id}`, { scroll: true });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLHeadingElement>) => {
    // using `event.key` (Modern standard)
    if (event.key === "Enter" || event.key === " ") {
      // required to stop the page from scrolling on Space
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <Component
      tabIndex={0}
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
      role="button"
      // oxlint-disable-next-line typescript/no-base-to-string
      aria-label={`${rest.children}`}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      {...rest}
    />
  );
};
