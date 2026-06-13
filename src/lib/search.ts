import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { cwd } from "node:process";

import { Singleton } from "@jadeja/ts/lib/singleton";
import MiniSearch from "minisearch";

import type { DocsConfig } from "@/types/config";

/* ============================================================================================= */

export type CreateSearchInstanceOptions = Pick<
  DocsConfig["constants"],
  "SEARCH_INDEX_FIELDS" | "SEARCH_INDEX_RETURN_FIELDS" | "SEARCH_INDEX_FILE_NAME"
>;

/**
 * builds and manages the static search index for documentation content
 *
 * exposes:
 *
 * - `instance.ingestAll`
 */
export class Search {
  //
  private miniSearchInstance!: MiniSearch;
  private searchOptions!: CreateSearchInstanceOptions;

  public static create(path: string, searchOptions: CreateSearchInstanceOptions) {
    // LSS: Local Static Search
    return new this().init(`LSS:${path}`, searchOptions);
  }

  private init(path: string, searchOptions: CreateSearchInstanceOptions) {
    //
    const instance = Singleton.get<Search & Singleton>(path);

    const registerMethods = instance.registerMethods.bind(instance, this);

    registerMethods(["createSearchInstance", "ingestAll"]);

    if (!instance.searchOptions) {
      instance.searchOptions = searchOptions;
    }

    if (!instance.miniSearchInstance) {
      instance.miniSearchInstance = instance.createSearchInstance();
    }

    return instance;
  }

  /* =========================
		BUILD TIME
	========================= */

  private createSearchInstance() {
    return new MiniSearch({
      fields: this.searchOptions.SEARCH_INDEX_FIELDS,
      storeFields: this.searchOptions.SEARCH_INDEX_RETURN_FIELDS,
    });
  }

  public ingestAll<T>(documents: T[]) {
    //
    this.miniSearchInstance.addAll(documents);

    const searchIndexPath = join(cwd(), "public", this.searchOptions.SEARCH_INDEX_FILE_NAME);
    const serachContent = {
      index: this.miniSearchInstance.toJSON(),
      documents,
    };

    writeFileSync(searchIndexPath, JSON.stringify(serachContent));
  }
}
