import { Button as BaseButton } from "@base-ui/react/button";

import { cls, cva } from "@/lib/dom/utils";

import type { ReactElement } from "react";

import type { VariantProps } from "@/lib/dom/utils";

/* ============================================================================================= */

// oxlint-disable-next-line react/only-export-components
export const buttonVariants = cva("btn", {
  variants: {
    variant: {
      outline: "btn--outline",
      secondary: "btn--secondary",
      ghost: "btn--ghost",
      success: "btn--success",
      danger: "btn--danger",
      info: "btn--info",
      warning: "btn--warning",
    },

    size: {
      sm: "btn--sm",
      md: "btn--md",
      lg: "btn--lg",
      icon: "btn--icon",
      "icon-sm": "btn--icon--sm",
      "icon-md": "btn--icon--md",
      "icon-lg": "btn--icon--lg",
    },

    hasIcon: {
      false: null,
      true: "has-icon",
    },
  },
  defaultVariants: {
    hasIcon: false,
  },
});

/* ============================================================================================= */

export type ButtonProps = BaseButton.Props & VariantProps<typeof buttonVariants>;

// NOTE: add `has-icon` class. this will help with `:has`.
// `:has` not supported yet in Shilp CSS baseline.
export const Button = ({
  className,
  hasIcon = false,
  variant,
  size,
  type = "button",
  ...rest
}: ButtonProps): ReactElement<HTMLButtonElement> => {
  return (
    <BaseButton
      {...rest}
      nativeButton={!rest.render}
      className={cls(buttonVariants({ variant, size, hasIcon }), className)}
      // prevent form from submitting on enter key press,
      // by default, it consider any button as submit button
      type={type}
    />
  );
};
