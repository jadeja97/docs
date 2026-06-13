import { Separator as BaseSeparator } from "@base-ui/react/separator";

import { cls } from "@/lib/dom/utils";

import type { ReactElement } from "react";

/* ============================================================================================= */

export type SeparatorProps = BaseSeparator.Props & {
  vertical?: boolean;
};

export const Separator = ({
  className,
  vertical = false,
  ...rest
}: SeparatorProps): ReactElement<HTMLDivElement> => {
  return (
    <BaseSeparator
      {...rest}
      orientation={vertical ? "vertical" : "horizontal"}
      className={cls("separator", className)}
    />
  );
};
