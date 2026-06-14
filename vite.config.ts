import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import viteLib, { createInputEntries } from "@jadeja/ts/configs/vite/lib";
import { deepMergeObj } from "@jadeja/ts/lib/operations";
import vitePluginCopyFolders from "@jadeja/ts/plugins/vite/copy-folders";
import dts from "unplugin-dts/vite";
import { defineConfig } from "vite";

import { peerDependencies } from "./package.json";

import type { UserConfig } from "vite";

/* ============================================================================================= */

const viteConfig: UserConfig = defineConfig(
  //

  deepMergeObj(viteLib({ peerDependencies }), {
    //

    /* ============================================================================================
      BUILD
    ============================================================================================ */

    build: {
      //
      rolldownOptions: {
        input: createInputEntries({
          dirname: import.meta.dirname,
          entries: [
            "src/components/**/*.tsx",
            "src/config/index.ts",
            "src/hooks/**/*.ts",
            "src/lib/**/*.ts",
            "src/markdown/**/*.{ts,tsx}",
            "src/scripts/**/*.ts",
            "src/types/**/*.ts",
            "src/main.ts",
          ],
        }),
      },
    },

    /* ============================================================================================
      ALIAS
    ============================================================================================ */

    resolve: {
      alias: {
        "@": resolve(import.meta.dirname, "./src"),
      },
    },

    /* ============================================================================================
      PLUGINS
    ============================================================================================ */

    plugins: [
      //
      dts({
        entryRoot: resolve("./src"),
        outDirs: resolve("./dist"),
        afterBuild(emittedFiles) {
          for (const [path, content] of emittedFiles.entries()) {
            writeFileSync(path, content.replaceAll("from '../", "from './"));
          }
        },
      }),

      //
      vitePluginCopyFolders(import.meta.dirname, [
        {
          src: "./src/styles",
          dest: "./dist/styles",
        },
      ]),
    ],
  }),
);

/* ============================================================================================= */

export default viteConfig;
