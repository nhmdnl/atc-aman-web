import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ATC Aman — Air Traffic Control Simulation for Asmara",
  description:
    "A single-player, real-time air traffic control simulation for Asmara International Airport (HHAS), Eritrea. Built with Electron, TypeScript, React, and PixiJS.",
  keywords: [
    "ATC",
    "air traffic control",
    "simulation",
    "Asmara",
    "Eritrea",
    "HHAS",
    "Electron",
    "TypeScript",
    "PixiJS",
    "game",
  ],
  authors: [{ name: "Nahom Daniel Negash" }],
  openGraph: {
    title: "ATC Aman — Air Traffic Control Simulation",
    description:
      "Sit in the tower at Asmara International Airport and work arrivals and departures across Ground, Tower, and Approach stations.",
    url: "https://github.com/nhmdnl/ATC-TS-Aman",
    siteName: "ATC Aman",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ATC Aman — Air Traffic Control Simulation",
    description:
      "A real-time ATC simulation for Asmara International Airport (HHAS), Eritrea.",
  },
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
      </body>
    </html>
  );
}
