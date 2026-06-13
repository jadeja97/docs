import oxfmtNext from "@jadeja/ts/configs/oxfmt/next";
import { defineConfig } from "oxfmt";

import type { OxfmtConfig } from "oxfmt";

/* ============================================================================================= */

const oxfmtConfig: OxfmtConfig = defineConfig({ ...oxfmtNext });

/* ============================================================================================= */

export default oxfmtConfig;
