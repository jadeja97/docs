/* remark plugins */
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";

import { remarkCodeMeta } from "@/markdown/plugins/remark-code-meta";
import { remarkTOC } from "@/markdown/plugins/remark-toc";

/* rehype plugins */
import rehypeSlug from "rehype-slug";

import type { NextMDXOptions } from "@next/mdx";

/* ============================================================================================= */

/**
 * mdx processing configurations (`@next/mdx`)
 */
export const mdxConfig: NextMDXOptions = {
  options: {
    /* process markdown */
    remarkPlugins: [remarkFrontmatter, remarkGfm, remarkCodeMeta, remarkTOC],

    /* process html */
    rehypePlugins: [rehypeSlug],
  },
};
