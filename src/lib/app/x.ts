import type { App, Author } from "@/types/config";
import type { FrontMatter } from "@/types/content";

/* ============================================================================================= */

export interface XOptions {
  owner: Author;
  app: App;
  frontMatter: FrontMatter;
}

export const x = ({ owner, app, frontMatter }: XOptions) => {
  return {
    title: frontMatter.title,
    description: frontMatter.description,
    card: "summary_large_image",
    images: [app.images.og.url],
    site: app.x.site,
    siteId: app.x.siteId,
    creator: owner.x.creator,
    creatorId: owner.x.creatorId,
  };
};
