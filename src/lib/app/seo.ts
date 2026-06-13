import { getAuthors } from "@/lib/app/authors";
import { articleJSON_LD, websiteJSON_LD } from "@/lib/app/json-ld";
import { articleOG, websiteOG } from "@/lib/app/og";
import { x } from "@/lib/app/x";
import { cleanURL } from "@/lib/dom/utils";

import type { Metadata } from "next";

import type { App, DocsConfig } from "@/types/config";
import type { FrontMatter } from "@/types/content";

/* ============================================================================================= */

export interface GetPageSEOOptions {
  authors: DocsConfig["authors"];
  app: App;
  url: string;
  SITE_URL: DocsConfig["constants"]["SITE_URL"];
  canonicalURL: string;
  frontMatter: FrontMatter;
  markdown?: `https://${string}`;
  trailingSlash: boolean | undefined;
}

export const getPageSEO = ({
  authors,
  SITE_URL,
  app,
  url,
  markdown,
  canonicalURL,
  frontMatter,
  trailingSlash,
}: GetPageSEOOptions): Metadata => {
  //
  const pageAuthors = getAuthors({ authorsList: authors, authors: frontMatter.authors });

  return {
    title: frontMatter.title,
    description: frontMatter.description,
    keywords: frontMatter.keywords,

    authors: pageAuthors.seoRootAuthors,

    alternates: {
      canonical: cleanURL(SITE_URL, canonicalURL, trailingSlash),
      types: {
        ...(markdown && { "text/markdown": markdown }),
      },
    },

    openGraph: articleOG({
      app,
      frontMatter,
      owner: pageAuthors.owner,
      SITE_URL,
      trailingSlash,
      url,
    }),

    twitter: x({ app, frontMatter, owner: pageAuthors.owner }),

    other: {
      "application/ld+json": JSON.stringify(
        articleJSON_LD({
          owner: pageAuthors.owner,
          SITE_URL,
          url,
          frontMatter,
          trailingSlash,
        }),
      ),
    },
  };
};

/* ============================================================================================= */

export interface GetHomePageSEOOptions {
  SITE_URL: string;
  app: App;
  authors: DocsConfig["authors"];
  frontMatter: FrontMatter;
  trailingSlash: boolean | undefined;
}

export const getHomePageSEO = ({
  SITE_URL,
  app,
  authors,
  frontMatter,
  trailingSlash = false,
}: GetHomePageSEOOptions): Metadata => {
  //
  const pageAuthors = getAuthors({ authorsList: authors, authors: frontMatter.authors });

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: app.name,
    publisher: app.publisher,
    creator: app.creator,

    title: app.home.title,
    description: app.description,
    keywords: app.keywords,

    alternates: app.home.alternates,

    authors: pageAuthors.seoRootAuthors,

    openGraph: websiteOG({ app, SITE_URL, trailingSlash, frontMatter }),

    twitter: x({ app, frontMatter, owner: pageAuthors.owner }),

    other: {
      "application/ld+json": JSON.stringify(
        websiteJSON_LD({
          owner: pageAuthors.owner,
          SITE_URL,
          appName: app.name,
          trailingSlash,
        }),
      ),
    },
  };
};
