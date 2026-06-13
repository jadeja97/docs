import { deepMergeObj } from "@jadeja/ts/lib/operations";

import { cleanURL } from "@/lib/dom/utils";
import { loadModule } from "@/lib/load-module";

import type { Content } from "@/lib/content";

/* ============================================================================================= */

/**
 * generates RSS feed for updates
 *
 * @param content - RSS feed
 * @param options - response options
 */
export const createRSSFile = (content: string, options: ResponseInit = {}) => {
  //
  return new Response(
    content,
    deepMergeObj(
      {
        headers: {
          "Content-Type": "application/rss+xml; charset=utf-8",
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
      options,
    ),
  );
};

/* ============================================================================================= */

export interface GetChannelItemMetaOptions {
  content: Content;
  SITE_URL: string;
  slugs: string[];
  trailingSlash: boolean | undefined;
}

/**
 * get channel item metadata
 *
 * @param options - options for channel item metadata
 * @param options.content - content class instance
 * @param options.slugs - slugs for the page
 * @param options.SITE_URL - the site url (domain)
 * @param options.trailingSlash - wether to add trailing slash or not
 */
export const getChannelItemMeta = async ({
  content,
  slugs,
  SITE_URL,
  trailingSlash,
}: GetChannelItemMetaOptions): Promise<GenerateChannelItemOptions> => {
  //
  const docsModule = await loadModule({ content, slugs });

  if (!docsModule?.meta?.url) {
    return {} as GenerateChannelItemOptions;
  }

  const { meta } = docsModule;
  const { frontMatter } = meta;

  return {
    title: frontMatter.title,
    description: frontMatter.description,
    url: cleanURL(SITE_URL, meta.url, trailingSlash),
    guid: `${content.paths.dir}${slugs.join("")}${trailingSlash ? "/" : ""}`,
    publishedAt: frontMatter.publishedAt,
    lastModifiedAt: frontMatter.lastModifiedAt,
  };
};

/* ============================================================================================= */

export interface GenerateChannelItemOptions {
  title: string;
  description: string;
  url: string;
  guid: string;
  publishedAt: string;
  lastModifiedAt: string;
}

/**
 * generates channel item
 *
 * @param options - options for generating channel item
 * @param options.title - title
 * @param options.description - descriptoin
 * @param options.url - url
 * @param options.guid - unique id (can be anything)
 * @param options.publishedAt - publish time
 * @param options.lastModifiedAt - last modified time
 */
export const generateChannelItem = ({
  title,
  description,
  url,
  guid,
  publishedAt,
  lastModifiedAt,
}: GenerateChannelItemOptions) => {
  return `
		<item>
			<title>${escapeXML(title)}</title>
			<description>${escapeXML(description)}</description>
			<link>${escapeXML(url)}</link>
			<guid>${escapeXML(guid)}</guid>
			<pubDate>${new Date(publishedAt).toUTCString()}</pubDate>
      <lastBuildDate>${new Date(lastModifiedAt).toUTCString()}</lastBuildDate>
		</item>
`;
};

/* ============================================================================================= */

export type GetChannelItemsOptions = Omit<GetChannelItemMetaOptions, "slugs">;

/**
 * get channel item metadata
 *
 * @param options - options for channel item metadata
 * @param options.content - content class instance
 * @param options.SITE_URL - the site url (domain)
 * @param options.trailingSlash - wether to add trailing slash or not
 */
export const getChannelItems = async ({ content, ...rest }: GetChannelItemsOptions) => {
  // RSS channel items from changelog pages
  const items = [];

  // changelog slugs
  const changelogSlugs = content.getAllSlugs().filter(({ slugs }) => {
    return slugs[0] === "changelog" && slugs.length > 1;
  });

  for (const changelogSlug of changelogSlugs) {
    const item = await getChannelItemMeta({ content, slugs: changelogSlug.slugs, ...rest });
    items.push(item);
  }

  // changelogs sorted by descending last modified date
  const sortedItems = items.toSorted((a, b) => {
    return Number(b.lastModifiedAt) - Number(a.lastModifiedAt);
  });

  return sortedItems
    .map((item) => {
      return generateChannelItem(item);
    })
    .join("\n");
};

/* ============================================================================================= */

export interface GenerateRSSChannelOptions {
  title: string;
  description?: string;
  SITE_URL: string;
  dir: string;
  trailingSlash: boolean | undefined;
  language?: string;
  lastModifiedAt: string | undefined;
  items: string;
  ttl?: number;
}

/**
 * generates RSS feed channel
 *
 * @param options - options for generating RSS feed channel
 * @param options.title - channel title
 * @param options.description - channel descriptoin
 * @param options.SITE_URL - the site url (domain)
 * @param options.dir - the content directory name
 * @param options.trailingSlash - wether to add trailing slash or not
 * @param options.language - content language
 * @param options.lastModifiedAt - last modified time
 * @param options.items - channel items
 * @param options.ttl - how long a data packet or cached record remains valid before it expires or
 *   gets discarded
 */
export const generateRSSChannel = ({
  title,
  description,
  SITE_URL,
  dir,
  trailingSlash = false,
  language = "en-us",
  lastModifiedAt = "",
  items,
  ttl = 3600,
}: GenerateRSSChannelOptions) => {
  //
  return `
  <channel>
    <title>${title} Changelog</title>
    <link>${cleanURL(SITE_URL, `/${dir}/changelog`, trailingSlash)}</link>
    <description>Latest updates and announcements for ${description ?? title}</description>
    <language>${language}</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date(lastModifiedAt).toUTCString()}</lastBuildDate>
    <ttl>${ttl}</ttl>
    ${items}
  </channel>
`;
};

/* ============================================================================================= */

export interface GenerateRSSFeedOptions {
  content: Content;
  SITE_URL: string;
  trailingSlash: boolean | undefined;
  title: string;
  description?: string;
  language?: string;
  ttl?: number;
}

/**
 * generates RSS XML feed
 *
 * @param channels - options for generating RSS feed
 * @param items - RSS feed items
 */
export const generateRSSFeed = async (channels: GenerateRSSFeedOptions[]) => {
  //
  const rssChannels: string[] = [];

  for (const channel of channels) {
    //
    const { content, SITE_URL, trailingSlash = false, ...rest } = channel;

    const items = await getChannelItems({ content, SITE_URL, trailingSlash });
    const generatedChannel = generateRSSChannel({
      items,
      SITE_URL,
      dir: content.paths.dir,
      lastModifiedAt: content.getFileInfo(["changelog"]).meta?.frontMatter?.lastModifiedAt,
      trailingSlash,
      ...rest,
    });

    rssChannels.push(generatedChannel);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  ${rssChannels.join("\n")}
</rss>`;
};

/* ============================================================================================= */

/**
 * escapes XML special characters
 *
 * @param str - string to escape XML special characters
 */
export const escapeXML = (str: string) => {
  //
  if (!str) {
    return "";
  }

  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
};
