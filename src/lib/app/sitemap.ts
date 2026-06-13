import { getLastModified, removeMilliSeconds } from "@/lib/date-time";
import { cleanURL } from "@/lib/dom/utils";

import type { MetadataRoute } from "next";

import type { Content } from "@/lib/content";
import type { ArrayElement } from "@/types/utils";

/* ============================================================================================= */

export interface SiteMap extends ArrayElement<MetadataRoute.Sitemap> {
  lastModified: string;
  changeFrequency: ArrayElement<MetadataRoute.Sitemap>["changeFrequency"];
  priority: 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;
}

/* ============================================================================================= */

export type CreateSiteMapEntryBaseOptions = {
  SITE_URL: string;
  trailingSlash: boolean | undefined;
} & Partial<Omit<SiteMap, "lastModified">>;

export interface CreateSiteMapEntryWithFilePath extends CreateSiteMapEntryBaseOptions {
  filePath: string;
  lastModifiedAt?: never;
}

export interface CreateSiteMapEntryWithLastModifiedAt extends CreateSiteMapEntryBaseOptions {
  filePath?: never;
  lastModifiedAt: string;
}

export type CreateSiteMapEntryOptions =
  | CreateSiteMapEntryWithFilePath
  | CreateSiteMapEntryWithLastModifiedAt;

/**
 * create sitemap entry
 *
 * here trailing slash is important for correct URL structure and SEO for github pages, as it treats
 * URLs with and without trailing slash as different pages
 *
 * @param options - options for creating content sitemap entry
 * @param options.url - relative url from site url
 * @param options.filePath - the actual file path (not resolved)
 * @param options.lastModifiedAt - file last modified date and time
 * @param options.SITE_URL - the site url (domain)
 * @param options.trailingSlash - trailing slash for url
 * @param options.changeFrequency - set change frequency
 * @param options.priority - set priority
 */

export const createSiteMapEntry = ({
  lastModifiedAt,
  url = "",
  SITE_URL,
  changeFrequency = "monthly",
  priority = 0.7,
  filePath,
  trailingSlash = false,
}: CreateSiteMapEntryOptions): SiteMap => {
  //

  let lastModified = new Date().toISOString();

  if (lastModifiedAt) {
    lastModified = new Date(lastModifiedAt).toISOString();
  } else if (filePath) {
    lastModified = getLastModified(filePath);
  }

  return {
    url: cleanURL(SITE_URL, url, trailingSlash),
    lastModified: removeMilliSeconds(lastModified),
    changeFrequency,
    priority,
  };
};

/* ============================================================================================= */

export type CreateContentSiteMapEntriesOptions = Omit<
  CreateSiteMapEntryOptions,
  "filePath" | "lastModifiedAt" | "url"
> & {
  content: Content;
};

/**
 * create content sitemap entries
 *
 * here trailing slash is important for correct URL structure and SEO for github pages, as it treats
 * URLs with and without trailing slash as different pages
 *
 * @param options - options for creating content sitemap entry
 * @param options.content - the content class instance
 * @param options.SITE_URL - the site url (domain)
 * @param options.trailingSlash - trailing slash for url
 * @param options.changeFrequency - set change frequency
 * @param options.priority - set priority
 */
export const createContentSiteMapEntries = ({
  content,
  SITE_URL,
  trailingSlash = false,
  changeFrequency = "monthly",
  priority = 0.7,
}: CreateContentSiteMapEntriesOptions): SiteMap[] => {
  //
  const slugsWrapper = content.getAllSlugs();

  return slugsWrapper.map(({ slugs }) => {
    //
    const { meta } = content.getFileInfo(slugs);

    const { dir } = content.paths;
    const segments = slugs[0] === "" ? "" : slugs.join("/");

    const siteMap = createSiteMapEntry({
      url: `/${dir}${segments ? `/${segments}` : ""}`,
      // oxlint-disable-next-line typescript/no-non-null-assertion
      lastModifiedAt: meta!.frontMatter.lastModifiedAt,
      priority,
      changeFrequency,
      trailingSlash,
      SITE_URL,
    });

    return siteMap;
  });
};
