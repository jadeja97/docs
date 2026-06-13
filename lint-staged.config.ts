const lintStagedConfig = {
  // 1. run type checking once for the whole project
  // using a function to prevent file arguments being passed to tsc
  "*.{ts,tsx}": () => {
    return "tsc";
  },

  // 2. run formatting and linting ONLY on the changed files
  "*.{ts,tsx,json,md,css}": [
    "oxfmt --check --disable-nested-config",
    "oxlint --disable-nested-config",
  ],
};

/* ============================================================================================= */

export default lintStagedConfig;
