import type { DocsConfig } from "@/types/config";

/* ============================================================================================= */

/**
 * next configurations (`next.config.ts`)
 *
 * @param options - options for creating next config
 * @param options.githubPages - add options for deployment on github pages
 */
export const getNextConfig: DocsConfig["getNextConfig"] = ({ githubPages }) => {
  return {
    //
    reactCompiler: true,
    reactStrictMode: false,
    devIndicators: false,
    output: "export",
    distDir: "dist",
    pageExtensions: ["ts", "tsx", "mdx"],
    typescript: {
      ignoreBuildErrors: true,
    },

    /* ==============================================================================================
		STATIC HOST SETUP - GITHUB PAGES
	============================================================================================== */

    ...(githubPages && {
      trailingSlash: true,
      images: {
        unoptimized: true,
      },
    }),

    /* ==============================================================================================
		EXPERIMENTAL FEATURES
	============================================================================================== */

    experimental: {
      turbopackFileSystemCacheForDev: false,
      turbopackFileSystemCacheForBuild: false,
    },
  };
};
