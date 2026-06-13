import type { ResolveOptions } from "webpack";

import type { DocsConfig } from "@/types/config";

/* ============================================================================================= */

/**
 * webpack configurations (`next.config.ts`)
 *
 * @param config - default Next.js webpack config
 * @param options - options for webpack config
 * @param options.plugins - new webpack plugins
 * @param options.alias - add alias
 */
export const getWebpackConfig: DocsConfig["getWebpackConfig"] = (config, { plugins, alias }) => {
  //
  if ((plugins?.length ?? 0) > 0) {
    // @ts-expect-error  type issue
    config.plugins?.push(...plugins);
  }

  config.resolve ??= {} as ResolveOptions;

  config.resolve.alias = Object.assign(config.resolve.alias ?? {}, alias ?? {});

  return config;
};
