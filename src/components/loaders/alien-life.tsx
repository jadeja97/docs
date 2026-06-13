import { cls } from "@/lib/dom/utils";

import type { ComponentProps, ReactElement } from "react";

/* ============================================================================================= */

export type AlientLifeProps = ComponentProps<"div">;

/*
	author: andrew-manzyk
	link: https://uiverse.io/andrew-manzyk/young-walrus-64
*/
export const AlienLife = ({
  className,
  ...rest
}: AlientLifeProps): ReactElement<HTMLDivElement> => {
  return (
    <div className={cls("alien-life", className)} {...rest}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <defs>
          <mask id="clipping">
            <polygon points="0,0 100,0 100,100 0,100" fill="black" />
            <polygon points="25,25 75,25 50,75" fill="white" />
            <polygon points="50,25 75,75 25,75" fill="white" />
            <polygon points="35,35 65,35 50,65" fill="white" />
            <polygon points="35,35 65,35 50,65" fill="white" />
            <polygon points="35,35 65,35 50,65" fill="white" />
            <polygon points="35,35 65,35 50,65" fill="white" />
          </mask>
        </defs>
      </svg>
      <div className="box" />
    </div>
  );
};
