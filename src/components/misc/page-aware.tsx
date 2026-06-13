"use client";

/* ============================================================================================= */

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

import { sanitizePathname } from "@/lib/dom/utils";

import type { ReactElement } from "react";

import type { DocsConfig } from "@/types/config";

/* ============================================================================================= */

export type AddDataToHTML = (
  pathname: string,
  SITE_URL: DocsConfig["constants"]["SITE_URL"],
  // using `sanitizePathname` from module creates runtime error (not fatal) in browser console
  // as imported module is not in scope for `script` tag (`InitialLoad`)
  // prevent error by passing it as function parameter
  sanatize: typeof sanitizePathname,
) => void;

const addDataAttrToHTML: AddDataToHTML = (pathname, SITE_URL, sanitize) => {
  //
  const path = sanitize(pathname, SITE_URL);
  const [_emptyString, root] = path.split("/");

  const html = document.documentElement;

  // trailing slash added for github pages,
  // so we need to remove it for normal path
  const isTrailingSlash = path !== "/" && path.endsWith("/");

  html.dataset.path = (isTrailingSlash ? path.slice(0, -1) : path) || "/";
  html.dataset.root = root || "home";
  //
};

/* ============================================================================================= */

export type RoutingProps = Pick<DocsConfig["constants"], "SITE_URL">;

/**
 * adds `data-path` and `data-root` attr to html on initial load (before dom paint)
 *
 * @param options - options for routing
 * @param options.SITE_URL - site url or domain
 */
export const Routing = ({ SITE_URL }: RoutingProps) => {
  //
  const pathname = usePathname();

  useLayoutEffect(() => {
    //
    addDataAttrToHTML(pathname, SITE_URL, sanitizePathname);
    //
  }, [pathname, SITE_URL]);

  return null;
};

/* ============================================================================================= */

export type InitialLoadProps = Pick<DocsConfig["constants"], "SITE_URL">;

/**
 * adds `data-path` and `data-root` attr to html on client navigation (before dom paint)
 *
 * @param options - options for routing
 * @param options.SITE_URL - site url or domain
 */
export const InitialLoad = ({ SITE_URL }: InitialLoadProps): ReactElement<HTMLScriptElement> => {
  return (
    <script
      suppressHydrationWarning
      // oxlint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `
				(function(pathname, addDataAttrToHTML) {
					//
					addDataAttrToHTML(pathname, "${SITE_URL}", ${sanitizePathname});
					//
				})(location.pathname, ${addDataAttrToHTML})
			`,
      }}
    />
  );
};
