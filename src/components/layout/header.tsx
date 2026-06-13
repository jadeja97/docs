import { cls } from "@/lib/dom/utils";

import type { ComponentProps, ReactElement, ReactNode } from "react";

/* ============================================================================================= */

export type HeaderRootProps = {
  children: ReactNode;
} & ComponentProps<"div">;

export const HeaderRoot = ({
  children,
  className,
  ...rest
}: HeaderRootProps): ReactElement<HTMLDivElement> => {
  return (
    <div className={cls("header__wrapper", className)} {...rest}>
      {children}
    </div>
  );
};

/* ============================================================================================= */

export type HeaderProps = {
  children: ReactNode;
} & ComponentProps<"header">;

export const Header = ({ children, ...rest }: HeaderProps): ReactElement<HTMLDivElement> => {
  return <header {...rest}>{children}</header>;
};
