import { GoogleAnalytics as GA } from "@next/third-parties/google";
import Script from "next/script";

import type { ReactElement } from "react";

/* ============================================================================================= */

export interface GoogleAnalyticsProps {
  PROD: boolean;
  id?: string;
}

export const GoogleAnalytics = ({ PROD, id }: GoogleAnalyticsProps): null | ReactElement => {
  //
  if (!(PROD && id)) {
    return null;
  }

  return <GA gaId={id} />;
};

/* ============================================================================================= */

export interface MicrosoftClarityProps {
  PROD: boolean;
  id?: string;
}

export const MicrosoftClarity = ({
  PROD,
  id,
}: MicrosoftClarityProps): null | ReactElement<HTMLScriptElement> => {
  //

  if (!(PROD && id)) {
    return null;
  }

  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){
          c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments) };
          t = l.createElement(r);
          t.async=1;
          t.src="https://www.clarity.ms/tag/"+i;
          y = l.getElementsByTagName(r)[0];
          y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", ${id});
      `}
    </Script>
  );
};
