import { deepMergeObj } from "@jadeja/ts/lib/operations";

/* ============================================================================================= */

/**
 * add `llms.txt` file to public folder at build time
 *
 * @param content - instructions for LLMs
 * @param options - response options
 */
export const createLLMsFile = (content: string, options: ResponseInit = {}) => {
  //
  return new Response(
    content,
    deepMergeObj(
      {
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
      options,
    ),
  );
};
