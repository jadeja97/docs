"use client";

/* ============================================================================================= */

import debounce from "@jadeja/ts/lib/debounce";
import { useState } from "react";

import { CheckIcon, CopyIcon } from "@/components/assets/icons";
import { Button } from "@/components/button";
import { cls } from "@/lib/dom/utils";

import type { ComponentProps, ReactElement } from "react";

/* ============================================================================================= */

export type CopyToClipboardProps = {
  text: string;
} & ComponentProps<"button">;

export const CopyToClipboard = ({
  text,
  className,
  ...rest
}: CopyToClipboardProps): null | ReactElement<HTMLButtonElement> => {
  //
  const [copied, setCopied] = useState<boolean | Promise<boolean>>(false);

  if (!text) {
    return null;
  }

  // handle copy (with avoiding rage clicks)
  const handleCopy = () => {
    //
    setCopied(async (prev) => {
      //
      if (!prev) {
        //
        await navigator.clipboard.writeText(text);

        return true;
      }

      return prev;
    });

    // delay the reset
    debounce(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Button
      variant="outline"
      size="icon-sm"
      onClick={handleCopy}
      title={copied ? undefined : "copy to clipboard"}
      className={cls("copy-to-clipboard", className)}
      data-copied={copied ? true : undefined}
      {...rest}
    >
      {/*  */}
      {copied ? <CheckIcon /> : <CopyIcon />}

      <span className="screen-reader">{copied ? "copied" : "copy"} to clipboard</span>
    </Button>
  );
};
