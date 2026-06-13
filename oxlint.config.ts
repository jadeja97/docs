import oxlintNext from "@jadeja/ts/configs/oxlint/next";
import { defineConfig } from "oxlint";

import type { OxlintConfig } from "oxlint";

/* ============================================================================================= */

const oxlintConfig: OxlintConfig = defineConfig({ ...oxlintNext, ignorePatterns: ["example"] });

/* ============================================================================================= */

export default oxlintConfig;
