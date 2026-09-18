import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ClarityScript } from "@/components/analytics/clarity-script";

const SITE_URL = "https://atc-aman-web.vercel.app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ATC Aman — Air Traffic Control Simulation for Asmara",
    template: "%s | ATC Aman",
  },
  description:
    "ATC Aman is a free, single-player air traffic control simulation for Asmara International Airport (HHAS), Eritrea. Work Ground, Tower, and Approach positions in real time — radar scope, voice ATIS, scoring, and realistic arrival management.",
  keywords: [
    "ATC",
    "air traffic control",
    "arrival manager",
    "AMAN",
    "simulation",
    "Asmara",
    "Eritrea",
    "HHAS",
    "approach control",
    "radar",
    "flight simulator companion",
    "aviation game",
  ],
  authors: [{ name: "Nahom Daniel Negash" }],
  openGraph: {
    title: "ATC Aman — Air Traffic Control Simulation for Asmara",
    description:
      "Sit in the tower at Asmara International Airport (HHAS) and work real-time arrivals and departures across Ground, Tower, and Approach. Free to download on Windows.",
    url: SITE_URL,
    siteName: "ATC Aman",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ATC Aman — Air Traffic Control Simulation for Asmara International Airport",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ATC Aman — Air Traffic Control Simulation for Asmara",
    description:
      "A free, real-time ATC simulation for Asmara International Airport (HHAS), Eritrea. Ground, Tower & Approach in your browser of choice — download for Windows.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0f1e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
        <Analytics />
        <ClarityScript />
      </body>
    </html>
  );
}
