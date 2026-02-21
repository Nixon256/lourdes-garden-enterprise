/**
 * Google Analytics 4 component for Lourdes Garden
 * Add NEXT_PUBLIC_GA_MEASUREMENT_ID to your .env file and Vercel environment variables.
 *
 * Usage: Add <GoogleAnalyticsProvider /> inside <head> in app/layout.tsx
 * This is a Server Component – scripts are injected at SSR time for instant detection.
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
