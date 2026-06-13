import { Alert } from "@/components/alert";
import { CodeBlock } from "@/components/code-block";
import { Link } from "@/components/link";
import { List } from "@/components/list";
import { TableComposed } from "@/components/table";
import { Headings } from "@/markdown/components/heading";

import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";

import type { OLProps } from "@/components/list";

/* ================================================================================================
	HTML Elements
================================================================================================ */

export const HTMLElements: MDXComponents = {
  /* link */
  a: Link,

  /* headings */
  h1: (props: ComponentProps<"h1">) => {
    return <Headings {...props} as="h1" />;
  },
  h2: (props: ComponentProps<"h2">) => {
    return <Headings {...props} as="h2" />;
  },
  h3: (props: ComponentProps<"h3">) => {
    return <Headings {...props} as="h3" />;
  },
  h4: (props: ComponentProps<"h4">) => {
    return <Headings {...props} as="h4" />;
  },
  h5: (props: ComponentProps<"h5">) => {
    return <Headings {...props} as="h5" />;
  },
  h6: (props: ComponentProps<"h6">) => {
    return <Headings {...props} as="h6" />;
  },

  /* code */
  // pre: don't use `pre` custom component
  code: CodeBlock,

  /* list */
  ul: List,
  ol: (props: OLProps) => {
    return <List {...props} ordered />;
  },

  /* table */
  table: TableComposed,
};

/* ================================================================================================
	JSX Components
================================================================================================ */

export const TSXComponents: MDXComponents = {
  Alert,
};
