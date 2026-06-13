"use client";

/* ============================================================================================= */

import { default as NextLink } from "next/link.js";
import { usePathname } from "next/navigation.js";

import type { LinkProps as NextLinkProps } from "next/link";
import type { ReactElement, ComponentProps } from "react";

/* ============================================================================================= */

export type LinkProps = ComponentProps<"a"> &
  NextLinkProps & {
    navLink?: boolean;
    "data-active"?: boolean;
  };

export type LinkAttrs = ComponentProps<"a"> & {
  href: LinkProps["href"];
};

export const Link = ({ href, navLink, ...rest }: LinkProps): ReactElement<HTMLAnchorElement> => {
  //
  const pathname = usePathname();

  if (!href) {
    throw new Error("`href` prop is missing!");
  }

  // open external link in new tab
  const handleExternalLink = () => {
    //
    const attrs: LinkAttrs = { href };

    if (href.startsWith("https://")) {
      attrs.rel = "noopener noreferrer";
      attrs.target = "_blank";
    }

    return attrs;
  };

  // add `data-active` attr to active url
  const handleActiveLink = () => {
    //
    if (rest["data-active"]) {
      return {};
    }

    const isActive = navLink ? pathname.includes(href) : pathname === href;

    return {
      "data-active": (isActive && href !== "/") || undefined,
    };
  };

  return (
    <NextLink
      // new page navigation start from top
      scroll
      {...rest}
      {...handleExternalLink()}
      {...handleActiveLink()}
    />
  );
};
