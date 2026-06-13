import { visit } from "unist-util-visit";

import type { Root } from "mdast";

/* ============================================================================================= */

/**
 * remark plugin to extract code metadata as props
 */
export const remarkCodeMeta = () => {
  return (tree: Root) => {
    visit(tree, "code", (node) => {
      // filter backtick code (``)
      // it doesn't have `lang`
      if (!node.lang) {
        return;
      }

      // ensure data exist
      node.data ??= {};

      // expose props to `code` element
      // hProperties passed as serialized
      // @ts-expect-error  type issue
      // oxlint-disable-next-line typescript/no-unsafe-assignment
      node.data.hProperties = {
        // @ts-expect-error  type issue
        ...node.data.hProperties,
        lang: node.lang,
        // rawValue: node.value,
        ...processMeta(node.meta),
      };
    });
  };
};

/* ============================================================================================= */

/**
 * convert `code` meta string to props object
 *
 * @param meta - code metadata string
 */
export const processMeta = <T>(meta: T) => {
  //
  const result: Record<string, string | boolean> = {};

  // matches:
  // key="value"
  // key='value'
  // key=value
  // key
  const matches = /(\w+)(?:=(?:"([^"]*)"|'([^']*)'|(\S+)))?/g.exec((meta || "") as string);

  if (matches) {
    //
    const [_allMatches, key, kv1, kv2, keyOnly] = matches;
    // pick whichever capture group matched
    const value = kv1 ?? kv2 ?? keyOnly;
    // boolean flag
    result[key] = value ?? true;
  }

  return result;
};
