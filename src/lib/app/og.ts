import { removeMilliSeconds } from "@/lib/date-time";
import { cleanURL } from "@/lib/dom/utils";

import type { Metadata } from "next";

import type { App, Author } from "@/types/config";
import type { FrontMatter } from "@/types/content";

/* ============================================================================================= */

export interface ArticleOGOptions {
  owner: Author;
  app: App;
  url: string;
  frontMatter: FrontMatter;
  trailingSlash: boolean | undefined;
  SITE_URL: string;
}

export const articleOG = ({
  owner,
  app,
  SITE_URL,
  url,
  frontMatter,
  trailingSlash,
}: ArticleOGOptions): Metadata["openGraph"] => {
  return {
    title: frontMatter.title,
    description: frontMatter.description,
    url: cleanURL(SITE_URL, url, trailingSlash),
    type: "article",
    publishedTime: removeMilliSeconds(frontMatter.publishedAt),
    modifiedTime: removeMilliSeconds(frontMatter.lastModifiedAt),
    authors: owner.name,
    siteName: app.name,
    locale: app.locale,
    images: [app.images.og],
    countryName: app.country,
  };
};

/* ============================================================================================= */

export interface WebsiteOGOptions {
  app: App;
  SITE_URL: string;
  frontMatter: FrontMatter;
  trailingSlash: boolean | undefined;
}

export const websiteOG = ({
  app,
  SITE_URL,
  trailingSlash,
  frontMatter,
}: WebsiteOGOptions): Metadata["openGraph"] => {
  return {
    title: frontMatter.title,
    description: frontMatter.description,
    url: cleanURL(SITE_URL, "", trailingSlash),
    type: "website",
    siteName: app.name,
    locale: app.locale,
    countryName: app.country,
    images: [app.images.og],
  };
};
