import { freshRegex } from "@jadeja/ts/lib/operations";

export { default as cls } from "clsx";

/* ============================================================================================= */

export { cva } from "class-variance-authority";

export type { VariantProps } from "class-variance-authority";

/* ============================================================================================= */

export const sanitizePathname = (path: string, base: string) => {
  //
  const { pathname } = new URL(path, base);

  return (
    pathname
      // remove traversal
      .replaceAll("..", "")
      // collapse slashes
      .replaceAll(/\/+/g, "/") || "/"
  );
};

/* ============================================================================================= */

export type cleanURL = [string] | [string, string, boolean | undefined];

/**
 * clearn URL
 *
 * @param url - URL to clean
 */
export const cleanURL = (...args: cleanURL) => {
  //
  let url: string = "";

  if (args.length === 3) {
    url = `${args[0]}${args[1] ? `/${args[1]}` : ""}${args[2] ? "/" : ""}`;
  } else if (args.length === 1) {
    [url] = args;
  }

  const [protocol, segments] = url.split("://");
  const path = segments.replaceAll(freshRegex(/\/+/g), "/");

  return `${protocol}://${path}`;
};
