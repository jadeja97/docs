import { cls } from "@/lib/dom/utils";

import type { ComponentProps, ReactElement } from "react";

/* ============================================================================================= */

export type LiveStarProps = ComponentProps<"div">;

/*
	author: narmesh_sah
	link: https://uiverse.io/narmesh_sah/hungry-pig-40
*/
export const LiveStar = ({ className, ...rest }: LiveStarProps): ReactElement<HTMLDivElement> => {
  return (
    <div className={cls("live-star__wrapper", className)} {...rest}>
      <div className="live-star">
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};
