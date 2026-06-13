// oxlint-disable eslint/max-lines

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { cwd } from "node:process";

import { log, throwError } from "@jadeja/ts/lib/logger";
import { Singleton } from "@jadeja/ts/lib/singleton";
import frontMatter from "front-matter";
import grayMatter from "gray-matter";

import { getLastModified } from "@/lib/date-time";
import { Search } from "@/lib/search";

import type {
  AddMetaOptions,
  ContentBaseOptions,
  CreateFileMetaOptions,
  CreateFolderMetaOptions,
  CreateTreeOptions,
  FileInfo,
  FileMeta,
  Folder,
  FolderMeta,
  FrontMatter,
  FullMeta,
  List,
  Meta,
  Neighbours,
  Paths,
  Slugs,
  Tree,
} from "@/types/content";

/* ============================================================================================= */

/**
 * builds the content tree from the `/src/content` directory.
 *
 * exposed properties:
 *
 * - `instance.paths`
 *
 * exposed methods:
 *
 * - `instance.getTree`
 * - `instance.getAllSlugs`
 * - `instance.getFileInfo`
 * - `instance.getNeighbours`
 */
// oxlint-disable-next-line typescript/ban-types, typescript/no-empty-object-type
export class Content<U extends Record<string, unknown> = {}> {
  //
  public paths!: Paths;
  private slugs!: Slugs;
  private list!: List;
  private tree!: Tree;
  private search!: Search & Singleton;
  private options!: ContentBaseOptions & U;

  public static create<U extends Record<string, unknown>>(
    dir: string,
    options: ContentBaseOptions & U,
  ) {
    // cast 'new this<U>()' to 'Content<U>' to help TS understand the instance type
    const instance = new this<U>();

    // perform the initialization
    return instance.init(dir, options);
  }

  private init<T extends U>(dir: string, options: ContentBaseOptions & T) {
    //
    const paths = this.getPaths(dir);

    const instance = Singleton.get<Content<U> & Singleton>(paths.path);

    const registerMethods = instance.registerMethods.bind(instance, this);

    instance.options ??= options;

    instance.paths ??= paths;

    // register methods, so `this` would point to singleton instance and not this class
    registerMethods([
      "readFile",
      "readMeta",
      "getLength",
      "createTree",
      "createFileMeta",
      "createFolderMeta",
      "addMeta",
      "buildSearchIndex",
      "getNavigationURL",
      "getURLSafeFilePath",
      "getTree",
      "getAllSlugs",
      "getFileInfo",
      "getNeighbours",
    ]);

    if (!instance.slugs) {
      instance.slugs = new Map();
    }

    // TODO: use tree structure to reduce the memory
    if (!instance.list) {
      instance.list = new Map();
    }

    if (!instance.tree) {
      instance.tree = instance.createTree({});
    }

    // create search index
    if (!instance.search) {
      instance.search = Search.create(paths.path, options.search);
      instance.buildSearchIndex();
    }

    return instance;
  }

  private getPaths(dir: string): Paths {
    // path from project root: {contentRoot}{dir}
    const root = join("src", "content", dir);

    return {
      // relative path from project root: {contentRoot}
      root: "src/content",
      // content directory: {dir}
      dir,
      // relative path from project root: {root}/{dir}
      path: root,
      // absolute path: {pathFromDrive|pathFromRoot}/{project}/{root}/{dir}
      PATH: join(cwd(), root),
    };
  }

  /* =========================
		READ FILE
	========================= */

  private readFile(filePATH: Paths["PATH"]) {
    //
    const isFileExist = existsSync(filePATH);

    if (!isFileExist) {
      return throwError(`File not found!!! :: ${filePATH}`);
    }

    return readFileSync(filePATH, "utf8");
  }

  private readMeta(PATH: Paths["PATH"]): Meta {
    //
    const file = this.readFile(join(PATH, "meta.json"));

    return JSON.parse(file) as Meta;
  }

  /* ===========================
		NAVIGATION URL & FILE PATH
	=========================== */

  // create navigation url from slugs
  private getNavigationURL(slugs: string[]) {
    return [`/${this.paths.dir}`, ...slugs].join("/") + (this.options.trailingSlash ? "/" : "");
  }

  // get path for dynamic import
  private getURLSafeFilePath(...args: string[]) {
    return join(...args)
      .split(sep)
      .join("/");
  }

  /* =========================
		NAVIGATION TREE
	========================= */

  // primarily used for `reservedIndex`
  private getLength() {
    return this.list.size;
  }

  private createTree({
    PATH = this.paths.PATH,
    parentSlugs = [],
    reservedIndex = -1,
  }: CreateTreeOptions): Tree {
    //
    const meta = this.readMeta(PATH);

    if (!meta.items) {
      return [];
    }

    // all the files in current folder is processed first
    // so, creating a queue to hold folders
    const folderQueue: Folder[] = [];

    // get files meta only, queue the folders
    const files: (FileMeta | null)[] = meta.items.map((item) => {
      // remove hidden files and folders
      if (item.hidden) {
        return null;
      }

      // file meta
      if (!item.type || item.type === "file") {
        return this.createFileMeta({ PATH, parentSlugs, file: item, reservedIndex });
      }

      // queue folders - processed last
      // this creates issue: https://github.com/JadejaHQ/shilpcss/issues/32
      if (item.type === "folder") {
        folderQueue.push(item);
      }

      return null;
    });

    // get folders meta
    const folders = folderQueue.map((folder) => {
      // hidden folders handled at files processing (above block)
      return this.createFolderMeta({ PATH, parentSlugs, folder });
    });

    return [
      ...files.filter((x) => {
        return x !== null;
      }),
      ...folders,
    ];
  }

  private createFileMeta({ PATH, parentSlugs, file, reservedIndex = -1 }: CreateFileMetaOptions) {
    // create file metadata
    const fileFromMeta = typeof file === "string" ? { name: file } : file;

    const slug = fileFromMeta.slug ?? fileFromMeta.name;

    let slugs = parentSlugs;

    if (slug !== "index") {
      slugs = [...parentSlugs, slug];
    }

    // NOTE: provide label only when need to have `-` in it
    const label = fileFromMeta.label ?? slug.replaceAll("-", " ");
    const { title } = fileFromMeta;

    const fileMeta: FileMeta = {
      type: "file",
      // text
      label,
      // title
      title,
      // link
      url: this.getNavigationURL(slugs),
    };

    this.addMeta({ PATH, slugs, file: `${fileFromMeta.name}.mdx`, meta: fileMeta, reservedIndex });

    return fileMeta;
  }

  private createFolderMeta({ PATH, parentSlugs, folder }: CreateFolderMetaOptions) {
    //
    const rawFolderName = folder.name;
    let folderName = folder.name;

    // example: "(root)", "(core-concepts)"
    const isVirtual = /^\(.*\)$/.test(rawFolderName);

    if (isVirtual) {
      folderName = rawFolderName.replace(/^\(|\)$/, "");
    }

    const folderPATH = join(PATH, rawFolderName);

    const childMeta = this.readMeta(folderPATH);

    const isPage = childMeta.page;

    // this will be ignored for if virtual
    const slug = childMeta.slug ?? folderName;

    const label = childMeta.label ?? (isVirtual ? folderName : slug).replaceAll("-", " ");
    const { title } = childMeta;

    let slugs = parentSlugs;

    if (!isVirtual && slug !== "index") {
      slugs = [...parentSlugs, slug];
    }

    // https://github.com/JadejaHQ/shilpcss/issues/32
    const reservedIndex = this.getLength();

    const folderMeta: FolderMeta = {
      type: "folder",
      isPage: false,
      // text
      label,
      // attr
      title,
      // childs
      childs: this.createTree({
        PATH: folderPATH,
        parentSlugs: slugs,
        reservedIndex: isPage ? reservedIndex : -1,
      }),
    };

    if (isPage) {
      // @ts-expect-error  this is valid
      folderMeta.isPage = true;
      // @ts-expect-error  this is valid
      folderMeta.url = this.getNavigationURL(slugs);

      if (!childMeta.name) {
        return throwError(`"name" property is missing at "${join(folderPATH, "meta.json")}`);
      }

      this.addMeta({
        PATH,
        slugs,
        file: join(rawFolderName, `${childMeta.name}.mdx`),
        meta: folderMeta,
        reservedIndex,
      });
    }

    return folderMeta;
  }

  private addMeta({ PATH, slugs, file, meta, reservedIndex = -1 }: AddMetaOptions): void {
    //
    let index = this.getLength();

    if (reservedIndex >= 0) {
      if (meta.type === "folder" && meta.isPage) {
        index = reservedIndex;
      } else if (index === reservedIndex) {
        this.list.set(reservedIndex, {} as FullMeta);
        index += 1;
      }
    }

    // NOTE: no leading slash
    const relativePath = relative(this.paths.PATH, PATH);

    // get data for search
    const filePATH = resolve(PATH, file);

    const fullMeta = { ...meta, id: index } as FullMeta;

    try {
      //
      const fileContent = this.readFile(filePATH);

      if (fileContent) {
        //
        const { attributes, body } = frontMatter<Partial<FrontMatter>>(fileContent);

        const fields = attributes;

        if (!fields.title || !fields.description || !fields.keywords || !fields.authors) {
          return throwError(
            `Missing frontmatter [title, description, keywords, authors] field(s) in ${filePATH} with index ${index}`,
          );
        }

        if (!fields.publishedAt || !fields.lastModifiedAt) {
          Object.assign(fields, {
            publishedAt: fields.publishedAt ?? new Date().toISOString(),
            lastModifiedAt: fields.lastModifiedAt ?? getLastModified(filePATH),
          });

          const newFileContent = grayMatter.stringify(body, fields);
          writeFileSync(filePATH, newFileContent, "utf8");

          log(`Frontmatter updated :: ${filePATH}`);
        }

        Object.assign(fullMeta, {
          frontMatter: fields,
          content: body,
        });
      }
      //
    } catch (error) {
      return throwError(error);
    }

    // get index from slug - O(1)
    this.slugs.set(slugs.join("/"), {
      index,
      filePath: this.getURLSafeFilePath(relativePath, file),
    });

    // get file metadata with index - O(1)
    this.list.set(index, fullMeta);
  }

  public getTree() {
    return this.tree;
  }

  /* =========================
		SEARCH
	========================= */

  private buildSearchIndex() {
    const documents = [...this.list.values()];
    this.search.ingestAll(documents);
  }

  /* =========================
    SLUGS & FILE INFO
	========================= */

  public getAllSlugs() {
    return [...this.slugs.keys()].map((slugs) => {
      return {
        // src/apps/{dir}/[[...slugs]]/page.tsx
        slugs: slugs.split("/"),
      };
    });
  }

  public getFileInfo(slugs = [] as string[]): FileInfo {
    //
    const fileInfo = this.slugs.get(slugs.join("/"));

    if (!fileInfo) {
      return {} as FileInfo;
    }

    return {
      ...fileInfo,
      meta: this.list.get(fileInfo.index),
    };
  }

  /* =========================
    NEIGHBOURS
	========================= */

  public getNeighbours(index: number): Neighbours {
    //
    return {
      prev: index > 0 ? this.list.get(index - 1) : null,
      next: index < this.list.size - 1 ? this.list.get(index + 1) : null,
    };
  }
}
