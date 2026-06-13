import { Dialog } from "@base-ui/react/dialog";

import { XIcon } from "@/components/assets/icons";
import { Button } from "@/components/button";
import { cls } from "@/lib/dom/utils";

import type { ComponentProps, ReactElement } from "react";

/* ============================================================================================= */

// NOTE: not a dom element
export const DialogRoot = Dialog.Root;

/* ============================================================================================= */

// NOTE: not a dom element
export const DialogPortal = Dialog.Portal;

/* ============================================================================================= */

export type DialogTriggerProps = Dialog.Trigger.Props;

export const DialogTrigger = ({
  className,
  ...rest
}: DialogTriggerProps): ReactElement<HTMLButtonElement> => {
  return <Dialog.Trigger {...rest} className={cls("dialog__trigger", className)} />;
};

/* ============================================================================================= */

export type DialogCloseProps = Dialog.Close.Props & {
  hideCloseButton?: boolean;
  isWrapper?: boolean;
  hideFocus?: boolean;
};

export const DialogClose = ({
  className,
  hideCloseButton = false,
  isWrapper = false,
  hideFocus = false,
  ...rest
}: DialogCloseProps): null | ReactElement<HTMLButtonElement> => {
  //
  if (hideCloseButton) {
    return null;
  }

  return (
    <Dialog.Close
      {...rest}
      {...(hideFocus ? { tabIndex: -1 } : {})}
      className={cls("dialog__close", { wrapper: isWrapper }, className)}
    />
  );
};

/* ============================================================================================= */

export type DialogOverlayProps = Dialog.Backdrop.Props;

export const DialogOverlay = ({
  className,
  ...rest
}: DialogOverlayProps): ReactElement<HTMLDivElement> => {
  return <Dialog.Backdrop {...rest} className={cls("dialog__overlay", className)} />;
};

/* ============================================================================================= */

export type DialogContentProps = Dialog.Popup.Props & {
  portal?: Dialog.Portal.Props;
  hideCloseButton?: boolean;
  overlay?: DialogOverlayProps;
  close?: DialogCloseProps;
};

export const DialogContent = ({
  children,
  portal = {},
  hideCloseButton = true,
  overlay = {},
  close = {},
  className,
  ref,
  ...rest
}: DialogContentProps): ReactElement<HTMLDivElement> => {
  return (
    <DialogPortal {...portal}>
      <DialogOverlay {...overlay} />
      <Dialog.Popup {...rest} className={cls("dialog__content", className)} ref={ref}>
        {/*  */}
        {children}

        <DialogClose
          hideCloseButton={hideCloseButton}
          render={<Button variant="ghost" size="icon-sm" />}
          {...close}
        >
          <XIcon />
          <span className="screen-reader">Close</span>
        </DialogClose>
      </Dialog.Popup>
    </DialogPortal>
  );
};

/* ============================================================================================= */

export type DialogHeaderProps = ComponentProps<"div">;

export const DialogHeader = ({
  className,
  ...rest
}: DialogHeaderProps): ReactElement<HTMLDivElement> => {
  return <div {...rest} className={cls("dialog__header", className)} />;
};

/* ============================================================================================= */

export type DialogFooterProps = ComponentProps<"div">;

export const DialogFooter = ({
  className,
  ...rest
}: DialogFooterProps): ReactElement<HTMLDivElement> => {
  return <div {...rest} className={cls("dialog__footer", className)} />;
};

/* ============================================================================================= */

export type DialogTitleProps = Dialog.Title.Props;

export const DialogTitle = ({
  className,
  ...rest
}: DialogTitleProps): ReactElement<HTMLHeadingElement> => {
  return <Dialog.Title {...rest} className={cls("dialog__title", className)} />;
};

/* ============================================================================================= */

export type DialogDescriptionProps = Dialog.Description.Props;

export const DialogDescription = ({
  className,
  ...rest
}: DialogDescriptionProps): ReactElement<HTMLParagraphElement> => {
  return <Dialog.Description {...rest} className={cls("dialog__description", className)} />;
};
