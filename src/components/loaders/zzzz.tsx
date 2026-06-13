import { cls } from "@/lib/dom/utils";

import type { ComponentProps, ReactElement } from "react";

/* ============================================================================================= */

export type ZZZZProps = ComponentProps<"div">;

/*
	author: necatimertmetin
	link: https://uiverse.io/necatimertmetin/quiet-bulldog-16
*/
export const ZZZZ = ({ className, ...rest }: ZZZZProps): ReactElement<HTMLDivElement> => {
  return (
    <div className={cls("zzzz", className)} {...rest}>
      <div>z</div>
      <div>z</div>
      <div>z</div>
      <div>z</div>
    </div>
  );
};
