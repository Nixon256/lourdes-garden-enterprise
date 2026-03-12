import type { Metadata } from "next";
import { Arima } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import { Toaster } from "react-hot-toast";
import CartDrawer from "@/components/cart/CartDrawer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import CustomCursor from "@/components/ui/CustomCursor";
import GoogleAnalyticsProvider from "@/components/analytics/GoogleAnalyticsProvider";
import MicrosoftClarityProvider from "@/components/analytics/MicrosoftClarityProvider";


const arima = Arima({
  subsets: ["latin", "tamil"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-arima",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Lourdes Garden | Premium Organic Farm & Global Agriculture Export",
  description: "Exporting premium organic black pepper, cardamom, and mountain bananas from Tamil Nadu. Certified global agricultural standards for international wholesale.",
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Lourdes Garden | Global Agricultural Excellence',
    description: 'Bilingual heritage farm exporting premium organic products from the mountains of Tamil Nadu.',
    images: ['/images/hero.png'],
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AgricultureService",
  "name": "Lourdes Garden",
  "image": "https://lourdesgarden.com/images/hero.png",
  "description": "Premium organic agricultural export from Tamil Nadu. Specializing in pepper, cardamom, and mountain bananas.",
  "url": "https://lourdesgarden.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "SIRUVATU, Oddanchatram, Vadakadu",
    "addressLocality": "Tamil Nadu",
    "postalCode": "624212",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "10.4764",
    "longitude": "77.6749"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Export Agriculture Products",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Organic Black Pepper" } },
      { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Green Cardamom" } },
      { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Mountain Banana" } }
    ]
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+919626494555",
    "contactType": "customer service"
  }
}

import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <GoogleAnalyticsProvider />
        <MicrosoftClarityProvider />
      </head>
      <body
        className={`${arima.variable} font-sans antialiased transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            {children}
            <CartDrawer />
            <WhatsAppButton />
            <CustomCursor />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
