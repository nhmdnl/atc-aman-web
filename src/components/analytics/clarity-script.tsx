"use client";

import Script from "next/script";

/**
 * Microsoft Clarity — session recordings, heatmaps, behavior analytics.
 * Loads asynchronously (afterInteractive) so it never blocks rendering.
 * Set NEXT_PUBLIC_CLARITY_ID in your environment (.env.local / Vercel dashboard)
 * to enable; without it nothing is injected.
 */
export function ClarityScript() {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  if (!clarityId) return null;

  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window,document,"clarity","script","${clarityId}");`}
    </Script>
  );
}
