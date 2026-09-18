import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ClarityScript } from "@/components/analytics/clarity-script";
import {
  SITE_URL,
  buildRootJsonLd,
  jsonLdScript,
  DISCLAIMER,
} from "@/lib/site";

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
    default: "ATC Aman — Asmara (HHAS) Air Traffic Control Simulator",
    template: "%s | ATC Aman",
  },
  description:
    "Free Windows download: single-player offline ATC simulation of Asmara International Airport (HHAS), Eritrea. Work Ground, Tower, and Approach in real time — radar scope, spoken phraseology, and session scoring. Entertainment only — not for training.",
  keywords: [
    "ATC simulator",
    "air traffic control simulator",
    "air traffic control game",
    "ATC game PC",
    "offline ATC simulator",
    "Asmara International Airport simulator",
    "HHAS ATC",
    "Asmara airport game",
    "approach control simulator",
    "tower control simulator",
    "aviation game",
    "Eritrea",
  ],
  authors: [{ name: "Nahom Daniel Negash" }],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "ATC Aman — Asmara (HHAS) Air Traffic Control Simulator",
    description:
      "Sit in the tower at Asmara International Airport (HHAS). Free Windows download — offline, single-player, real-time Ground / Tower / Approach. Entertainment only.",
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
    title: "ATC Aman — Asmara (HHAS) Air Traffic Control Simulator",
    description:
      "Free Windows ATC sim of Asmara International (HHAS). Offline, single-player Ground / Tower / Approach. Entertainment only — not for training.",
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
  other: {
    "entertainment-disclaimer": DISCLAIMER,
  },
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
  const jsonLd = buildRootJsonLd();

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
        />
        {children}
        <Toaster />
        <Analytics />
        <ClarityScript />
      </body>
    </html>
  );
}
