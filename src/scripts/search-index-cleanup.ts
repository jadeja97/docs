import { readdirSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { cwd } from "node:process";

import { log } from "@jadeja/ts/lib/logger";

import type { DocsConfig } from "@/types/config";

/* ============================================================================================= */

export type SearchIndexCleanup = (
  SEARCH_INDEX_KEY: DocsConfig["constants"]["SEARCH_INDEX_KEY"],
) => void;

/**
 * script to remove search index files
 *
 * @param SEARCH_INDEX_KEY - search index key (filename will start with this)
 */
export const searchIndexCleanup: SearchIndexCleanup = (SEARCH_INDEX_KEY) => {
  //
  const publicDir = join(cwd(), "public");

  const files = readdirSync(publicDir);

  const searchIndexFiles = files.filter((file) => {
    return file.startsWith(SEARCH_INDEX_KEY);
  });

  for (const file of searchIndexFiles) {
    //
    const filePath = join(publicDir, file);

    unlinkSync(filePath);
  }

  log(`::::::: SEARCH INDEX CLEANUP COMPLETED :::::::`);
};
