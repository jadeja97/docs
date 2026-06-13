import type { DocsConfig } from "@/types/config";
import type { FrontMatter } from "@/types/content";

/* ============================================================================================= */

export interface GetAuthorsOptions {
  authorsList: DocsConfig["authors"];
  authors: FrontMatter["authors"];
}

export const getAuthors = ({ authorsList, authors }: GetAuthorsOptions) => {
  //
  const currentAuthors = authors.map((author) => {
    return authorsList[author];
  });

  const seoRootAuthors = currentAuthors.map((author) => {
    return {
      name: author.name,
      url: author.link,
    };
  });

  return {
    owner: currentAuthors[0],
    authors: currentAuthors,
    seoRootAuthors,
  };
};
