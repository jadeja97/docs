import type { NextMDXOptions } from "@next/mdx";
import type { MDXComponents } from "mdx/types";
import type { NextConfig } from "next";
import type { ShilpConfig } from "shilpcss/types";
import type { Configuration } from "webpack";

import type { SVGEl, SVGProps } from "@/components/svg";

/* ============================================================================================= */

/* ================================================================================================
  DEFINE CONFIG
================================================================================================ */

export type DefineConfig = (userConfig: UserConfig) => DocsConfig;

/* ================================================================================================
  DOCS CONFIG
================================================================================================ */

export interface DocsConfig {
  app: App;
  authors: Record<string, Author>;
  analytics?: Analytics;
  constants: Constants;
  links: {
    navigations: Record<string, Link>;
    socials: Record<string, Link>;
  };
  mdxConfig: NextMDXOptions;
  mdxComponents?: {
    HTMLElements?: MDXComponents;
    TSXComponents?: MDXComponents;
  };
  shilpConfig: ShilpConfig;
  trailingSlash?: boolean;

  getNextConfig: (options: { githubPages?: boolean }) => NextConfig;

  getWebpackConfig: (
    config: Configuration,
    options: {
      plugins: Configuration["plugins"];
      alias:
        | {
            /**
             * new request.
             */
            alias: string | false | string[];
            /**
             * request to be redirected.
             */
            name: string;
            /**
             * redirect only exact matching request.
             */
          }[]
        | Record<string, string | false | string[]>;
    },
  ) => Configuration;
}

/* ================================================================================================
  USER CONFIG
================================================================================================ */

export type UserConfig = Omit<DocsConfig, "getNextConfig" | "getWebpackConfig" | "constants"> & {
  analytics?: Partial<Analytics>;
  constants: RequiredConstants & OptionalConstants;
  mdxConfig?: NextMDXOptions;
  shilpConfig?: ShilpConfig;
};

/* ================================================================================================
  CONSTANTS
================================================================================================ */

export type RequiredConstants = Pick<Constants, "DEV" | "PROD" | "SITE_URL" | "VERSION">;
export type OptionalConstants = Partial<Omit<Constants, keyof RequiredConstants>>;

export interface Constants {
  /**
   * version from `package.json`
   *
   * keep this updated to invalidate old search index cache
   */
  VERSION: string;

  /**
   * the site url (domain)
   */
  SITE_URL: string;

  /**
   * used for creating search index filename
   *
   * @default "search-index"
   */
  SEARCH_INDEX_KEY: string;

  /**
   * search index file name. this will be stored in public folder.
   *
   * dev: `${SEARCH_INDEX_KEY}-v-dev.json`
   *
   * prod: `${SEARCH_INDEX_KEY}-v-${VERSION}.json`
   */
  SEARCH_INDEX_FILE_NAME: `${string}-v-${string}.json`;

  /**
   * `true` if environment is "development"
   */
  DEV: boolean;

  /**
   * `true` if environment is "production"
   */
  PROD: boolean;

  /**
   * fields for search indexing
   */
  SEARCH_INDEX_FIELDS: string[];

  /**
   * search index result fields
   */
  SEARCH_INDEX_RETURN_FIELDS: string[];
}

/* ================================================================================================
  ANALYTICS
================================================================================================ */

export interface Analytics {
  /**
   * google analytics key
   */
  googleAnalytics?: string;

  /**
   * microsoft clarity key
   */
  microsoftClarity?: string;
}

/* ================================================================================================
  LINKS
================================================================================================ */

export interface Link {
  label: string;
  url: `https://${string}`;
  icon?: (props: SVGProps) => SVGEl;
  title?: string;
}

export interface AuthorLink {
  name: string;
  link: string;
  location: string;
  title: string;
}

/* ================================================================================================
  APP
================================================================================================ */

export interface App {
  name: string;
  description: string;
  keywords: string[];
  publisher: string;
  creator: Author["name"];
  locale: string;
  country: string;
  home: {
    title: {
      default: App["name"];
      template: `%s | ${App["name"]}`;
    };
    alternates: {
      canonical: "/";
      types: {
        "application/rss+xml": `https://${string}/rss.xml`;
        "text/x-sitemap+xml": `https://${string}/sitemap.xml`;
        "text/plain": `https://${string}/llms.txt`;
      };
    };
  };
  images: {
    og: {
      url: string;
      width: 1200;
      height: 630;
    };
  };
  x: {
    site: `@${string}`;
    siteId: string;
  };
}

/* ================================================================================================
  AUTHOR
================================================================================================ */

export interface Author {
  name: string;
  link: `https://${string}`;
  location: string;
  jobTitle: string;
  x: {
    creator: `@${string}`;
    creatorId: string;
  };
  socials: Record<string, AuthorLink>;
}
