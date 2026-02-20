'use client'

/**
 * Microsoft Clarity heatmap component for Lourdes Garden
 * Add CLARITY_PROJECT_ID to your .env.local file
 *
 * Usage: Add <MicrosoftClarityProvider /> inside <body> in app/layout.tsx
 */
export default function MicrosoftClarityProvider() {
    const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID

    if (!clarityId) return null

    return (
        <script
            dangerouslySetInnerHTML={{
                __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarityId}");
        `,
            }}
        />
    )
}
