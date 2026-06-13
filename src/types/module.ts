import type { FC } from "react";

import type { Content } from "@/lib/content";
import type { FileInfo, Neighbours, TOC } from "@/types/content";

/* ============================================================================================= */

export interface LoadModuleOptions {
  content: Content;
  slugs: string[];
}

export interface Module {
  MDXComponent: FC;
  toc: TOC[];
}

export type ModuleOutput = FileInfo &
  Module & {
    neighbours: Neighbours;
  };

export type LoadModuleOutput = Promise<ModuleOutput | null>;
