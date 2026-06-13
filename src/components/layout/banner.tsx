import { cls } from "@/lib/dom/utils";

import type { ComponentProps, ReactElement, ReactNode } from "react";

/* ============================================================================================= */

export type BannerRootProps = {
  children: ReactNode;
} & ComponentProps<"div">;

export const BannerRoot = ({
  children,
  className,
  ...rest
}: BannerRootProps): ReactElement<HTMLDivElement> => {
  return (
    <div className={cls("banner__wrapper", className)} {...rest}>
      {children}
    </div>
  );
};

/* ============================================================================================= */

export type BannerProps = {
  children: ReactNode;
} & ComponentProps<"div">;

export const Banner = ({
  children,
  className,
  ...rest
}: BannerProps): ReactElement<HTMLDivElement> => {
  return (
    <div className={cls("banner", className)} {...rest}>
      {children}
    </div>
  );
};
