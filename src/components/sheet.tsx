import { Dialog as Sheet } from "@base-ui/react/dialog";

import { XIcon } from "@/components/assets/icons";
import { Button } from "@/components/button";
import { cls } from "@/lib/dom/utils";

import type { ComponentProps, ReactElement } from "react";

/* ============================================================================================= */

// NOTE: not a dom element
export const SheetRoot = Sheet.Root;

/* ============================================================================================= */

// NOTE: not a dom element
export const SheetPortal = Sheet.Portal;

/* ============================================================================================= */

export type SheetTriggerProps = Sheet.Trigger.Props;

export const SheetTrigger = ({
  className,
  ...rest
}: SheetTriggerProps): ReactElement<HTMLButtonElement> => {
  return <Sheet.Trigger {...rest} className={cls("sheet__trigger", className)} />;
};

/* ============================================================================================= */

export type SheetCloseProps = Sheet.Close.Props & {
  hideCloseButton?: boolean;
  isWrapper?: boolean;
  hideFocus?: boolean;
};

export const SheetClose = ({
  className,
  hideCloseButton = false,
  isWrapper = false,
  hideFocus = false,
  ...rest
}: SheetCloseProps): null | ReactElement<HTMLButtonElement> => {
  //
  if (hideCloseButton) {
    return null;
  }

  return (
    <Sheet.Close
      {...rest}
      {...(hideFocus ? { tabIndex: -1 } : {})}
      className={cls("sheet__close", { wrapper: isWrapper }, className)}
    />
  );
};

/* ============================================================================================= */

export type SheetOverlayProps = Sheet.Backdrop.Props;

export const SheetOverlay = ({
  className,
  ...rest
}: SheetOverlayProps): ReactElement<HTMLDivElement> => {
  return <Sheet.Backdrop {...rest} className={cls("sheet__overlay", className)} />;
};

/* ============================================================================================= */

export type SheetContentProps = Sheet.Popup.Props & {
  portal?: Sheet.Portal.Props;
  side?: "left" | "right" | "top" | "bottom";
  hideCloseButton?: boolean;
  overlay?: SheetOverlayProps;
  close?: SheetCloseProps;
};

export const SheetContent = ({
  children,
  portal = {},
  side = "right",
  hideCloseButton = true,
  overlay = {},
  close = {},
  className,
  ref,
  ...rest
}: SheetContentProps): ReactElement<HTMLDivElement> => {
  return (
    <SheetPortal {...portal}>
      <SheetOverlay {...overlay} />
      <Sheet.Popup {...rest} className={cls("sheet__content", side, className)} ref={ref}>
        {/*  */}
        {children}

        <SheetClose
          hideCloseButton={hideCloseButton}
          render={<Button variant="ghost" size="icon-sm" />}
          {...close}
        >
          <XIcon />
          <span className="screen-reader">Close</span>
        </SheetClose>
      </Sheet.Popup>
    </SheetPortal>
  );
};

/* ============================================================================================= */

export type SheetHeaderProps = ComponentProps<"div">;

export const SheetHeader = ({
  className,
  ...rest
}: SheetHeaderProps): ReactElement<HTMLDivElement> => {
  return <div {...rest} className={cls("sheet__header", className)} />;
};

/* ============================================================================================= */

export type SheetFooterProps = ComponentProps<"div">;

export const SheetFooter = ({
  className,
  ...rest
}: SheetFooterProps): ReactElement<HTMLDivElement> => {
  return <div {...rest} className={cls("sheet__footer", className)} />;
};

/* ============================================================================================= */

export type SheetTitleProps = Sheet.Title.Props;

export const SheetTitle = ({
  className,
  ...rest
}: SheetTitleProps): ReactElement<HTMLHeadingElement> => {
  return <Sheet.Title {...rest} className={cls("sheet__title", className)} />;
};

/* ============================================================================================= */

export type SheetDescriptionProps = Sheet.Description.Props;

export const SheetDescription = ({
  className,
  ...rest
}: SheetDescriptionProps): ReactElement<HTMLParagraphElement> => {
  return <Sheet.Description {...rest} className={cls("sheet__description", className)} />;
};
