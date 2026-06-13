import { ChevronLeftIcon, ChevronRightIcon } from "@/components/assets/icons";
import { buttonVariants } from "@/components/button";
import { Link } from "@/components/link";
import { cls } from "@/lib/dom/utils";

import type { ReactElement } from "react";

import type { Neighbours as NeighboursType } from "@/types/content";

/* ============================================================================================= */

export type NeighboursProps = NeighboursType;

export const Neighbours = ({ prev, next }: NeighboursProps): ReactElement<HTMLDivElement> => {
  return (
    //

    <div className="page__neighbours">
      {prev?.url && (
        <Link
          className={cls("prev-btn", buttonVariants({ variant: "outline" }))}
          href={prev.url}
          title={prev.title}
        >
          <ChevronLeftIcon /> {prev.title ?? prev.label}
        </Link>
      )}

      {next?.url && (
        <Link
          className={cls("next-btn", buttonVariants({ variant: "outline" }))}
          href={next.url}
          title={next.title}
        >
          {next.title ?? next.label} <ChevronRightIcon />
        </Link>
      )}
    </div>
  );
};
