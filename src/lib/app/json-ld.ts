import { removeMilliSeconds } from "@/lib/date-time";
import { cleanURL } from "@/lib/dom/utils";

import type { App, Author, DocsConfig } from "@/types/config";
import type { FrontMatter } from "@/types/content";

/* ============================================================================================= */

export type AuthorJSON_LDOptions = Author;

export const getAuthorJSON_LD = ({
  name,
  jobTitle,
  link,
  location,
  socials,
}: AuthorJSON_LDOptions) => {
  return {
    "@type": "Person",
    name,
    jobTitle,
    url: link,
    sameAs: Object.values(socials).map((handle) => {
      return handle.link;
    }),
    homeLocation: {
      "@type": "Place",
      name: location,
    },
  };
};

/* ============================================================================================= */

export interface ArticleJSON_LDOptions {
  owner: Author;
  SITE_URL: DocsConfig["constants"]["SITE_URL"];
  url: string;
  frontMatter: FrontMatter;
  trailingSlash: boolean | undefined;
}

export const articleJSON_LD = ({
  owner,
  SITE_URL,
  url,
  frontMatter,
  trailingSlash,
}: ArticleJSON_LDOptions) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    url: cleanURL(SITE_URL, url, trailingSlash),
    headline: frontMatter.title,
    description: frontMatter.description,
    datePublished: removeMilliSeconds(frontMatter.publishedAt),
    dateModified: removeMilliSeconds(frontMatter.lastModifiedAt),
    author: getAuthorJSON_LD(owner),
  };
};

/* ============================================================================================= */

export interface WebsiteJSON_LDOptions {
  owner: Author;
  SITE_URL: DocsConfig["constants"]["SITE_URL"];
  appName: App["name"];
  trailingSlash: boolean | undefined;
}

export const websiteJSON_LD = ({
  owner,
  SITE_URL,
  appName,
  trailingSlash,
}: WebsiteJSON_LDOptions) => {
  return {
    "@context": "https://schema.org",
    "@type": "Website",
    url: cleanURL(SITE_URL, "", trailingSlash),
    name: appName,
    author: getAuthorJSON_LD(owner),
  };
};
