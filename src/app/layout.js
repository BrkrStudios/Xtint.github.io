import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ChatbaseWidget from "@/components/ChatbaseWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "XTINT | Professional Window Tinting in Houston, TX | Automotive & Residential",
  description: "Premium window tinting service in Houston & Cypress, TX. Automotive & residential tinting with ceramic technology, lifetime warranty. Get a free quote today!",
  keywords: "window tinting Houston, automotive tinting Texas, residential window tint, ceramic tint, UV protection, heat rejection, car tinting Cypress TX",
  authors: [{ name: "Xander Angulo", url: "https://xtintusa.com" }],
  creator: "XTINT",
  publisher: "XTINT",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://xtintusa.com",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: "#1a1a1a",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    type: "website",
    url: "https://xtintusa.com",
    siteName: "XTINT - Auto & Property Services",
    title: "XTINT | Auto & Property Services in Houston, TX",
    description: "Premium auto & property services in Houston with ceramic technology and lifetime warranty",
    images: [
      {
        url: "https://xtintusa.com/images/buisimage.png",
        width: 1200,
        height: 630,
        alt: "XTINT Auto & Property Services",
        type: "image/png",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "XTINT | Auto & Property Services in Houston, TX",
    description: "Premium auto & property services for vehicles and homes. Ceramic technology, lifetime warranty, same-day service available.",
    images: ["https://xtintusa.com/images/buisimage.png"],
  },
  metadataBase: new URL("https://xtintusa.com"),
};

export default function RootLayout({ children }) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "XTINT",
    "description": "Professional automotive and residential window tinting service in Houston, Texas",
    "url": "https://xtintusa.com",
    "telephone": "+1-832-776-5717",
    "email": "info@xtintusa.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Cypress, TX",
      "addressLocality": "Cypress",
      "addressRegion": "TX",
      "postalCode": "77429",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "29.8833",
      "longitude": "-95.6615"
    },
    "image": "https://xtintusa.com/images/buisimage.png",
    "priceRange": "$$",
    "areaServed": [
      {
        "@type": "City",
        "name": "Houston",
        "addressRegion": "TX"
      },
      {
        "@type": "City",
        "name": "Cypress",
        "addressRegion": "TX"
      }
    ],
    "service": [
      {
        "@type": "Service",
        "name": "Automotive Window Tinting",
        "description": "Premium ceramic films engineered to reject heat, block UV rays, and enhance privacy for vehicles"
      },
      {
        "@type": "Service",
        "name": "Residential Window Tinting",
        "description": "Premium ceramic films designed to keep homes cooler, protect interiors from UV rays, and provide privacy"
      }
    ],
    "founder": {
      "@type": "Person",
      "name": "Xander Angulo"
    },
    "sameAs": [
      "https://xtintusa.com"
    ]
  };

  return (
    <html lang="en">
      <head>
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ChatbaseWidget />
        {children}
      </body>
    </html>
  );
}
