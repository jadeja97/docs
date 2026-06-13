import { freshRegex } from "@jadeja/ts/lib/operations";
import GithubSlugger from "github-slugger";
import { visit } from "unist-util-visit";

import type { Root } from "mdast";

import type { TOC } from "@/types/content";

/* ============================================================================================= */

/**
 * remark plugin to export table of content (toc) from `.mdx` files
 */
export const remarkTOC = () => {
  return (tree: Root) => {
    const slugger = new GithubSlugger();
    const toc: TOC[] = [];

    visit(tree, "heading", (node) => {
      const text = node.children
        .filter((x) => {
          return x.type === "text";
        })
        .map((x) => {
          return x.value;
        })
        .join("");

      toc.push({
        level: node.depth,
        text,
        id: slugger.slug(text),
      } satisfies TOC);
    });

    /**
     * prevent XSS
     *
     * If a heading somehow contains: `## </script><script>alert(1)</script>`
     *
     * This will convert:
     *
     * - `<` to `\u003c`
     * - `>` to `\u003e`
     */
    const safeStr = JSON.stringify(toc)
      .replace(freshRegex(/</g), String.raw`\u003c`)
      .replace(freshRegex(/>/g), String.raw`\u003e`);

    // export toc from `.mdx` files
    tree.children.push({
      // @ts-expect-error  type issue
      type: "mdxjsEsm",
      // NOTE: with `value` only, `toc` is not exported. throwing error.
      value: `export const toc = ${safeStr};`,
      data: {
        estree: {
          type: "Program",
          sourceType: "module",
          body: [
            {
              type: "ExportNamedDeclaration",
              declaration: {
                type: "VariableDeclaration",
                kind: "const",
                declarations: [
                  {
                    type: "VariableDeclarator",
                    id: { type: "Identifier", name: "toc" },
                    init: {
                      type: "Literal",
                      // oxlint-disable-next-line typescript/no-unsafe-assignment
                      value: JSON.parse(safeStr),
                      raw: safeStr,
                    },
                  },
                ],
              },
              attributes: [],
              specifiers: [],
              source: null,
            },
          ],
        },
      },
    });
  };
};
