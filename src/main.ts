import { deepMergeObj } from "@jadeja/ts/lib/operations";

import { defaultConfig } from "@/config";

import type { DefineConfig, DocsConfig } from "@/types/config";

/* ============================================================================================= */

export const defineConfig: DefineConfig = (userConfig) => {
  //
  const resolvedConfig = deepMergeObj({ ...defaultConfig }, userConfig ?? {}) as DocsConfig;

  if (!userConfig.constants?.SEARCH_INDEX_FILE_NAME) {
    //
    const searchIndexKey = resolvedConfig.constants.SEARCH_INDEX_KEY;
    const pkgVersion = resolvedConfig.constants.DEV ? "dev" : resolvedConfig.constants.VERSION;

    // version is added here to invalidate old cache
    resolvedConfig.constants.SEARCH_INDEX_FILE_NAME = `${searchIndexKey}-v-${pkgVersion}.json`;
  }

  return resolvedConfig;
};
