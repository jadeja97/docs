import { Button } from "@/components/button";
import { ScrollToActiveTopic } from "@/components/docs/scroll-to-active-topic";
import { TOC as TOCComponent } from "@/components/docs/toc";
import { Topics } from "@/components/docs/topics";
import { SheetContent, SheetHeader, SheetRoot, SheetTitle, SheetTrigger } from "@/components/sheet";

import type { ReactElement } from "react";

import type { Tree, TOC } from "@/types/content";

/* ============================================================================================= */

export interface ContentNavMobileProps {
  topics: Tree;
  toc: TOC[];
}

export const ContentNavMobile = ({
  topics,
  toc,
}: ContentNavMobileProps): ReactElement<HTMLDivElement> => {
  return (
    <div className="content-nav__wrapper--mobile">
      <div className="content-nav container">
        <MobileTopics topics={topics} />
        <MobileTOC toc={toc} />
      </div>
    </div>
  );
};

/* ============================================================================================= */

export type MobileTopicsProps = Pick<ContentNavMobileProps, "topics">;

export const MobileTopics = ({ topics }: MobileTopicsProps): ReturnType<typeof SheetRoot> => {
  return (
    <SheetRoot>
      <SheetTrigger render={<Button variant="ghost" />}>Topics</SheetTrigger>
      <SheetContent side="left" hideCloseButton={false} className="content-nav__topics-content">
        <SheetHeader>
          <SheetTitle>Topics</SheetTitle>
        </SheetHeader>

        <div className="topics__wrapper--mobile scroll-fade">
          <Topics tree={topics} />
          <ScrollToActiveTopic isMobile />
        </div>
      </SheetContent>
    </SheetRoot>
  );
};
/* ============================================================================================= */

export type MobileTOCProps = Pick<ContentNavMobileProps, "toc">;

export const MobileTOC = ({ toc }: MobileTOCProps): ReturnType<typeof SheetRoot> => {
  return (
    <SheetRoot>
      <SheetTrigger render={<Button variant="ghost" />}>On This Page</SheetTrigger>
      <SheetContent side="right" hideCloseButton={false} className="content-nav__toc-content">
        <SheetHeader>
          <SheetTitle>On This Page</SheetTitle>
        </SheetHeader>

        <div className="toc__wrapper--mobile scroll-fade">
          <TOCComponent toc={toc} isMobile />
        </div>
      </SheetContent>
    </SheetRoot>
  );
};
