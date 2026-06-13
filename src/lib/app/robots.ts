import type { MetadataRoute } from "next";

/* ============================================================================================= */

/**
 * create rules for robots (crawlers)
 *
 * @param SITE_URL - the site url (domain)
 */
export const createRobotsRules = (SITE_URL: string): MetadataRoute.Robots => {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },

    sitemap: `${SITE_URL}/sitemap.xml`,
  };
};
