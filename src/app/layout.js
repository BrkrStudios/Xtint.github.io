import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "XTINT | Automotive & Residential Tinting",
  description: "XTINT | Automotive & Residential Tinting",
  openGraph: {
    type: "website",
    url: "https://xtintusa.com",
    title: "XTINT | Automotive & Residential Tinting",
    description: "XTINT | Automotive & Residential Tinting",
    images: [
      {
        url: "https://xtintusa.com/og/7.4.2023-31.jpg",
        width: 1200,
        height: 630,
        alt: "XTINT Tinting",
      },
    ],
    locale: "en_US",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
