import { cls } from "@/lib/dom/utils";

import type { ComponentProps, ReactElement, ReactNode } from "react";

/* ============================================================================================= */

export type FooterRootProps = {
  children: ReactNode;
} & ComponentProps<"div">;

export const FooterRoot = ({
  children,
  className,
  ...rest
}: FooterRootProps): ReactElement<HTMLDivElement> => {
  return (
    <div className={cls("footer__wrapper", className)} {...rest}>
      {children}
    </div>
  );
};

/* ============================================================================================= */

export type FooterProps = {
  children: ReactNode;
} & ComponentProps<"footer">;

export const Footer = ({ children, ...rest }: FooterProps): ReactElement<HTMLElement> => {
  return <footer {...rest}>{children}</footer>;
};

/* ============================================================================================= */

export type FooterCopyrightProps = {
  children: ReactNode;
} & ComponentProps<"small">;

export const FooterCopyright = ({
  children,
  className,
  ...rest
}: FooterCopyrightProps): ReactElement<HTMLElement> => {
  return (
    <small className={cls("footer__copyright", className)} {...rest}>
      {children}
    </small>
  );
};
