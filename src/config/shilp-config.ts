import type { ShilpConfig } from "shilpcss/types";

/* ============================================================================================= */

export const shilpConfig: ShilpConfig = {
  extend: {
    properties: {
      live: {
        scroll: {
          fade: {
            DEFAULT: {
              property: "--scroll-fade-direction: <v><i>;",
              values: {
                x: "to right",
                y: "to bottom",
              },
            },
            size: {
              property: "--scroll-fade-size: <v><i>;",
              resolve: "spacing",
              themeKey: "spacing",
            },
          },
        },
      },
    },
  },
};
