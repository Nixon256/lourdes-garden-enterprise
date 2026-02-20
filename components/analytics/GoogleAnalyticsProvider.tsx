'use client'

/**
 * Google Analytics 4 component for Lourdes Garden
 * Add GA_MEASUREMENT_ID to your .env.local file
 *
 * Usage: Add <GoogleAnalyticsProvider /> inside <body> in app/layout.tsx
 */
export default function GoogleAnalyticsProvider() {
    const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

    if (!gaId) return null

    return (
        <>
            <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <script
                dangerouslySetInnerHTML={{
                    __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
              send_page_view: true
            });
          `,
                }}
            />
        </>
    )
}
