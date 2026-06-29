import type { Constants } from "@/types/config";

/* ============================================================================================= */

/**
 * constants used for configuration
 */
export const constants: Constants = {
  /**
   * version from `package.json`
   *
   * keep this updated to invalidate old search index cache
   */
  VERSION: "0.0.0",

  /**
   * the site url (domain)
   */
  SITE_URL: "",

  /**
   * used for creating search index filename
   *
   * @default "search-index"
   */
  SEARCH_INDEX_KEY: "search-index",

  /**
   * search index file name. this will be stored in public folder.
   *
   * dev: `${SEARCH_INDEX_KEY}-v-dev.json`
   *
   * prod: `${SEARCH_INDEX_KEY}-v-${VERSION}.json`
   */
  // oxlint-disable-next-line node/no-process-env
  SEARCH_INDEX_FILE_NAME: `search-index-v-${process.env.NODE_ENV === "development" ? "dev" : "0.0.0"}.json`,

  /**
   * `true` if environment is "development"
   */
  // oxlint-disable-next-line node/no-process-env
  DEV: process.env.NODE_ENV === "development",

  /**
   * `true` if environment is "production"
   */
  // oxlint-disable-next-line node/no-process-env
  PROD: process.env.NODE_ENV === "production",

  /**
   * fields for search indexing
   */
  SEARCH_INDEX_FIELDS: [
    "title",
    "label",
    "url",
    "frontMatter.title",
    "frontMatter.description",
    "frontMatter.keywords",
    "content",
  ],

  /**
   * search result query options
   */
  SEARCH_INDEX_QUERY_OPTIONS: {
    prefix: true,
    fuzzy: 0.2,
    combineWith: "and",
    boost: {
      "frontMatter.title": 4,
      "frontMatter.description": 4,
      "frontMatter.keywords": 4,
      title: 3,
      url: 3,
      label: 2,
      content: 2,
    },
  },
};
