import { Link } from "@/components/link";
import { List } from "@/components/list";

import type { ReactElement } from "react";

import type { FileMeta, FolderMeta, PageFolder, RegularFolder, Tree } from "@/types/content";

/* ============================================================================================= */

export interface TopicsProps {
  tree: Tree;
}

export const Topics = ({ tree }: TopicsProps): ReactElement<HTMLDivElement> => {
  return (
    <div className="topics">
      {tree.map((branch) => {
        return <RenderChild key={branch.label} meta={branch} />;
      })}
    </div>
  );
};

/* ============================================================================================= */

export interface FolderProps {
  meta: RegularFolder;
}

export const Folder = ({ meta }: FolderProps): ReactElement<HTMLDivElement> => {
  return (
    <div data-folder={meta.label}>
      <span className="folder__label">{meta.label}</span>

      <List unstyled>
        {meta.childs.map((child) => {
          return (
            <li key={child.label}>
              <RenderChild meta={child} />
            </li>
          );
        })}
      </List>
    </div>
  );
};

/* ============================================================================================= */

export interface FolderPageProps {
  meta: PageFolder;
}

export const FolderPage = ({ meta }: FolderPageProps): ReactElement<HTMLDivElement> => {
  return (
    <div data-folder-page={meta.label}>
      {/*  */}
      <RenderChild meta={{ ...meta, type: "file" }} />

      <List unstyled>
        {meta.childs.map((child) => {
          return (
            <li key={child.label}>
              <RenderChild meta={child} />
            </li>
          );
        })}
      </List>
    </div>
  );
};

/* ============================================================================================= */

export interface RenderChildProps {
  meta: FileMeta | FolderMeta;
}

export const RenderChild = ({
  meta,
}: RenderChildProps): null | ReturnType<typeof Link | typeof Folder | typeof FolderPage> => {
  //

  if (meta.type === "file") {
    return (
      <Link href={meta.url} title={meta.title}>
        {meta.label}
      </Link>
    );
  }

  if (meta.type === "folder") {
    if (meta.isPage) {
      return <FolderPage meta={meta} />;
    }
    return <Folder meta={meta} />;
  }

  return null;
};
