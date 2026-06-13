import { resolve } from "node:path";

import { createInputEntries, viteLib as viteLibFn } from "@jadeja/ts/configs/vite/lib";
import vitePluginCopyFolders from "@jadeja/ts/plugins/vite/copy-folders";
import dts from "unplugin-dts/vite";
import { defineConfig } from "vite";

import { peerDependencies } from "./package.json";

/* ============================================================================================= */

const viteLib = viteLibFn({ peerDependencies });

const viteConfig = defineConfig({
  //

  ...viteLib,

  /* ==============================================================================================
		BUILD
	============================================================================================== */

  build: {
    //
    ...viteLib.build,

    //
    rolldownOptions: {
      //
      ...viteLib.build?.rolldownOptions,

      input: createInputEntries({
        dirname: import.meta.dirname,
        entries: [
          "src/components/**/*.{ts,tsx}",
          "src/hooks/**/*.{ts,tsx}",
          "src/lib/**/*.{ts,tsx}",
          "src/markdown/**/*.{ts,tsx}",
          "src/types/**/*.ts",
          "src/scripts/**/*.ts",
          "src/main.ts",
          "src/config/index.ts",
        ],
      }),
    },
  },

  /* ==============================================================================================
		ALIASE
	============================================================================================== */

  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src"),
    },
  },

  /* ==============================================================================================
		PLUGINS
	============================================================================================== */

  plugins: [
    //
    dts({
      entryRoot: "src",
      outDirs: "dist",
    }),

    //
    vitePluginCopyFolders(import.meta.dirname, [
      {
        src: "./src/styles",
        dest: "./dist/styles",
      },
    ]),
  ],
});

/* ============================================================================================= */

export default viteConfig;
