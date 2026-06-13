import { throwError } from "@jadeja/ts/lib/logger";

import type { FC } from "react";

import type { Module, LoadModuleOptions, LoadModuleOutput } from "@/types/module";

/* ============================================================================================= */

/**
 * load `mdx` file as module with additional information
 *
 * @param options - Options for the loading module
 * @param options.content - the content class instance
 * @param options.slugs - segments for the current module
 */
export const loadModule = async ({ content, slugs }: LoadModuleOptions): LoadModuleOutput => {
  // get current page info
  const { filePath, index, ...fileInfo } = content.getFileInfo(slugs);

  if (typeof index !== "number" || !filePath) {
    return null;
  }

  // get previous and next page info
  const neighbours = content.getNeighbours(index);

  let mdxModule: Module;

  try {
    // dynamically import `.mdx` file as module
    // oxlint-disable-next-line typescript/no-unsafe-assignment
    const dynamicModule: Omit<Module, "MDXComponent"> & {
      default: FC;
    } = await import(`@/content/${content.paths.dir}/${filePath}`);

    if (!dynamicModule?.default) {
      throw new Error(`Module not found :: "@/content/${content.paths.dir}/${filePath}"`);
    }

    const { default: MDXComponent, ...rest } = dynamicModule;

    mdxModule = {
      MDXComponent,
      ...rest,
    };
  } catch (error) {
    return throwError(error);
  }

  return {
    filePath,
    index,
    neighbours,
    ...fileInfo,
    ...mdxModule,
  };
};
