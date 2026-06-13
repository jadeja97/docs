import {
  CheckSquareIcon,
  JournalTextIcon,
  MegaphoneFillIcon,
  RadioActiveFillIcon,
  TrafficConeFillIcon,
} from "@/components/assets/icons";
import { cls, cva } from "@/lib/dom/utils";

import type { ComponentProps, ReactElement } from "react";

import type { SVGEl, SVGProps } from "@/components/svg";
import type { VariantProps } from "@/lib/dom/utils";

/* ============================================================================================= */

// oxlint-disable-next-line react/only-export-components
export const alertVariants = cva("alert", {
  variants: {
    //
    variant: {
      success: "alert--success",
      info: "alert--info",
      warning: "alert--warning",
      danger: "alert--danger",
    },

    hasIcon: {
      false: null,
      true: "has-icon",
    },

    defaultVariants: {
      hasIcon: true,
    },
  },
});

/* ============================================================================================= */

export type AlertProps = RootProps;

// NOTE: add `has-icon` class. this will help with `:has`.
// `:has` not supported yet in Shilp CSS baseline.
export const Alert = ({
  variant,
  hasIcon = true,
  title,
  children,
  ...rest
}: AlertProps): ReactElement<ReturnType<typeof AlertRoot>> => {
  return (
    <AlertRoot {...rest} hasIcon={hasIcon} variant={variant}>
      {/*  */}
      {hasIcon && <AlertIcon variant={variant} />}

      <AlertTitle variant={variant}>{title}</AlertTitle>

      {children && <AlertDescription>{children}</AlertDescription>}
    </AlertRoot>
  );
};

/* ============================================================================================= */

export type RootProps = ComponentProps<"div"> & VariantProps<typeof alertVariants>;

// NOTE: add `has-icon` class. this will help with `:has`.
// `:has` not supported yet in Shilp CSS baseline.
export const AlertRoot = ({
  className,
  variant,
  hasIcon,
  ...rest
}: RootProps): ReactElement<HTMLDivElement> => {
  return (
    <div {...rest} role="alert" className={cls(alertVariants({ variant, hasIcon }), className)} />
  );
};

/* ============================================================================================= */

export type IconProps = ComponentProps<"svg"> & Pick<VariantProps<typeof alertVariants>, "variant">;

// oxlint-disable-next-line react/only-export-components
export const getIcon = <T,>(variant: T): ((props: SVGProps) => SVGEl) => {
  switch (variant) {
    case "info":
      return MegaphoneFillIcon;
    case "warning":
      return TrafficConeFillIcon;
    case "success":
      return CheckSquareIcon;
    case "danger":
      return RadioActiveFillIcon;
    default:
      return JournalTextIcon;
  }
};

export const AlertIcon = ({ variant, ...rest }: IconProps): SVGEl => {
  //
  const Component = getIcon(variant);

  // oxlint-disable-next-line react-hooks-js/static-components
  return <Component {...rest} />;
};

/* ============================================================================================= */

export type TitleProps = ComponentProps<"div"> & Pick<VariantProps<typeof alert>, "variant">;

export const AlertTitle = ({
  children,
  className,
  variant,
  ...rest
}: TitleProps): ReactElement<HTMLDivElement> => {
  return (
    <div {...rest} className={cls("alert__title limit-lines", className)}>
      {children ?? variant ?? "Note"}
    </div>
  );
};

/* ============================================================================================= */

export type DescriptionProps = ComponentProps<"div">;

export const AlertDescription = ({
  className,
  ...rest
}: DescriptionProps): ReactElement<HTMLDivElement> => {
  return <div {...rest} className={cls("alert__description", className)} />;
};
