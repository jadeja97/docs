import { CopyToClipboard } from "@/components/copy-to-clipboard";
import { cls } from "@/lib/dom/utils";

import type { ComponentProps, ReactElement, ReactNode } from "react";

/* ============================================================================================= */

export type CodeBlockWithLangProps = {
  lang?: string;
  title?: string;
  children: string;
} & ComponentProps<"div">;

export type CodeBlockWithoutLangProps = {
  lang?: never;
  title?: string;
  children: string;
} & ComponentProps<"code">;

export type CodeBlockProps = CodeBlockWithLangProps | CodeBlockWithoutLangProps;

export const CodeBlock = (props: CodeBlockProps): ReactElement<HTMLElement | HTMLDivElement> => {
  return (
    // @ts-expect-error  suppress the error
    <CodeBlockRoot {...props}>
      {props.lang ? (
        <>
          <CodeBlockHead title={props.title} content={props.children} />
          <CodeBlockBody>{props.children}</CodeBlockBody>
        </>
      ) : (
        props.children
      )}
    </CodeBlockRoot>
  );
};

/* ============================================================================================= */

export type CodeBlockRootWithLangProps = {
  lang?: string;
  title?: string;
  children: ReactNode;
} & ComponentProps<"div">;

export type CodeBlockRootWithoutLangProps = {
  lang?: never;
  title?: string;
  children: string;
} & ComponentProps<"code">;

export type CodeBlockRootProps = CodeBlockRootWithLangProps | CodeBlockRootWithoutLangProps;

export const CodeBlockRoot = (
  props: CodeBlockRootProps,
): ReactElement<HTMLElement | HTMLDivElement> => {
  //
  if (!props.lang) {
    // don't need title for code
    // oxlint-disable-next-line eslint/no-unused-vars
    const { lang, title, children, className, ...rest } = props;
    return <code {...rest}>{children}</code>;
  }

  // don't need title for div
  // oxlint-disable-next-line eslint/no-unused-vars
  const { lang, title, children, className, ...rest } = props;

  return (
    <div className={cls("code-block", className)} data-lang={lang} {...rest}>
      {children}
    </div>
  );
};

/* ============================================================================================= */

export type CodeBlockHeadProps = {
  title?: string;
  content: string;
} & ComponentProps<"div">;

export const CodeBlockHead = ({
  title,
  content,
  className,
  ...rest
}: CodeBlockHeadProps): null | ReactElement<HTMLDivElement> => {
  //
  if (!title) {
    return null;
  }

  return (
    <div className={cls("code-block__header", className)} {...rest}>
      <span>{title}</span>
      <CopyToClipboard text={content} />
    </div>
  );
};

/* ============================================================================================= */

export type CodeBlockBodyProps = {
  children: string;
} & ComponentProps<"div">;

export const CodeBlockBody = ({
  children,
  className,
  ...rest
}: CodeBlockBodyProps): ReactElement<HTMLDivElement> => {
  return (
    <div className={cls("code-block__body", className)} {...rest}>
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
};
