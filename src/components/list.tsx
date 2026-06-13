import { useId } from "react";

import type { OlHTMLAttributes, HTMLAttributes, ReactElement } from "react";

/* ============================================================================================= */

export interface ListSharedProps {
  unstyled?: boolean;
  caption?: string;
}

export type ULProps = ListSharedProps &
  HTMLAttributes<HTMLUListElement> & {
    ordered?: false;
  };

export type OLProps = ListSharedProps &
  OlHTMLAttributes<HTMLOListElement> & {
    ordered: true;
  };

export type ListProps = OLProps | ULProps;

export const List = ({
  ordered = false,
  unstyled = false,
  caption,
  ...rest
}: ListProps):
  | ReactElement<HTMLUListElement>
  | ReactElement<HTMLOListElement>
  | ReactElement<HTMLDivElement> => {
  //
  const Component = ordered ? "ol" : "ul";
  const unstyledProps = unstyled ? { role: "list" as const, "data-unstyled": true as const } : {};

  if (caption) {
    return (
      <ListWithCaption
        unstyledProps={unstyledProps}
        {...rest}
        caption={caption}
        component={Component}
      />
    );
  }

  return <Component {...unstyledProps} {...rest} />;
};

/* ============================================================================================= */

export interface ListSharedPropsWithCaption {
  caption: string;
  unstyledProps: Partial<{
    role: "list";
    "data-unstyled": true;
  }>;
}

export type OLPropsWithCaption = ListSharedPropsWithCaption &
  OlHTMLAttributes<HTMLOListElement> & {
    component: "ol";
  };

export type ULPropsWithCaption = ListSharedPropsWithCaption &
  HTMLAttributes<HTMLUListElement> & {
    component: "ul";
  };

export type ListWithCaptionProps = OLPropsWithCaption | ULPropsWithCaption;

export const ListWithCaption = ({
  component: Component,
  caption,
  unstyledProps,
  ...rest
}: ListWithCaptionProps) => {
  //
  const uid = useId();

  return (
    <div className="list">
      <p id={uid} className="list__caption">
        {caption}
      </p>
      <Component {...unstyledProps} {...rest} aria-labelledby={uid} />
    </div>
  );
};
