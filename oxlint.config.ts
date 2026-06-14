import oxlintNext from "@jadeja/ts/configs/oxlint/next";
import { deepMergeObj } from "@jadeja/ts/lib/operations";
import { defineConfig } from "oxlint";

import type { OxlintConfig } from "oxlint";

/* ============================================================================================= */

const oxlintConfig: OxlintConfig = defineConfig(
  deepMergeObj(oxlintNext, {
    rules: {
      "unicorn/catch-error-name": ["error", { ignore: ["err"] }],
    },
  }),
);

/* ============================================================================================= */

export default oxlintConfig;
