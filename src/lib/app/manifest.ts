import type { MetadataRoute } from "next";

/* ============================================================================================= */

export interface ManifestOptions {
  siteName: string;
  description: string;
  color: string;
}

/**
 * create manifest
 *
 * @param options - options for creating manifest
 * @param options.siteName - site name
 * @param options.description - site description
 * @param options.color - site primary color
 */
export const createManifest = ({
  siteName,
  description,
  color,
}: ManifestOptions): MetadataRoute.Manifest => {
  return {
    name: siteName,
    short_name: siteName,
    description,
    start_url: "/",
    display: "standalone",
    background_color: color,
    theme_color: color,
    icons: [
      {
        src: "/favicon.ico",
        sizes: "64x64",
        type: "image/x-icon",
      },
    ],
  };
};
