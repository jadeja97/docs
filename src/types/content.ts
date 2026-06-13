import type { CreateSearchInstanceOptions } from "@/lib/search";
import type { DocsConfig } from "@/types/config";

/* ============================================================================================= */

/* ================================================================================================
  CONTENT
================================================================================================ */

export interface ContentBaseOptions {
  search: CreateSearchInstanceOptions;
  trailingSlash: DocsConfig["trailingSlash"];
}

/* ================================================================================================
  PATHS
================================================================================================ */

export interface Paths {
  /**
   * relative path from project root (_no leading slash_): {root}
   *
   * ⚠️ **THIS IS FIXED.**
   *
   * @default "src/content"
   */
  root: string;

  /**
   * content directory: {dir}
   *
   * example: "docs", "blogs"
   */
  dir: string;

  /**
   * relative path from project root: {root}/{dir}
   *
   * example: "src/content/docs", "src/content/blogs"
   */
  path: string;

  /**
   * absolute path
   *
   * - unix: {pathFromDrive}/{project}/{root}/{dir}
   * - windows: {pathFromRoot}/{project}/{root}/{dir}
   *
   * example
   *
   * - windows: "D:\dev\projects\jadeja-docs\src\content\docs"
   * - unix: "/home/dev/projects/jadeja-docs/src/content/docs"
   */
  PATH: string;
}

/* ================================================================================================
  SLUGS
================================================================================================ */

export type Slugs = Map<
  string,
  {
    index: number;
    filePath: string;
  }
>;

/* ================================================================================================
  LIST
================================================================================================ */

export type List = Map<number, FullMeta>;

/* ================================================================================================
  TREE
================================================================================================ */

export type Tree = (FileMeta | FolderMeta)[];

export interface CreateTreeOptions {
  PATH?: Paths["PATH"];
  parentSlugs?: string[];
  reservedIndex?: number;
}

/* ================================================================================================
  META
================================================================================================ */

export interface Meta {
  page?: boolean;
  slug?: string;
  label?: string;
  title?: string;
  name?: string;
  items: (File | Folder)[];
}

export type FullMeta = (FileMeta | FolderMeta) & {
  id: number;
  frontMatter: FrontMatter;
  content?: string;
};

export interface AddMetaOptions {
  PATH: Paths["PATH"];
  slugs: string[];
  file: string;
  meta: FileMeta | FolderMeta;
  reservedIndex?: number;
}

export interface FrontMatter {
  title: string;
  description: string;
  keywords: string[];
  publishedAt: string;
  lastModifiedAt: string;
  authors: (keyof DocsConfig["authors"])[];
}

/* ================================================================================================
  FILE
================================================================================================ */

export interface File {
  type?: "file";
  hidden?: boolean;
  name: string;
  slug?: string;
  label?: string;
  title?: string;
}

export interface FileMeta {
  type: "file";
  /**
   * text
   */
  label: string;
  /**
   * attr
   */
  title?: string;
  /**
   * link
   */
  url: string;
}

export interface CreateFileMetaOptions {
  PATH: Paths["PATH"];
  parentSlugs: string[];
  file: File;
  reservedIndex?: number;
}

export interface FileInfo {
  meta?: FullMeta;
  index?: number;
  filePath?: string;
}

/* ================================================================================================
  FOLDER
================================================================================================ */

export interface Folder {
  type: "folder";
  hidden?: boolean;
  name: string;
}

export interface FolderBase {
  type: "folder";
  /**
   * text
   */
  label: string;
  /**
   * attr
   */
  title?: string;
  /**
   * childs
   */
  childs: Tree;
}

export type PageFolder = FolderBase & {
  isPage: true;
  /**
   * link
   */
  url: string;
};

export type RegularFolder = FolderBase & {
  isPage?: false | undefined;
  url?: never;
};

export type FolderMeta = PageFolder | RegularFolder;

export interface CreateFolderMetaOptions {
  PATH: Paths["PATH"];
  parentSlugs: string[];
  folder: Folder;
}

/* ================================================================================================
  NEIGHBOURS
================================================================================================ */

export interface Neighbours {
  prev?: FullMeta | null;
  next?: FullMeta | null;
}

/* ================================================================================================
  TOC
================================================================================================ */

export interface TOC {
  level: number;
  text: string;
  id: string;
}
