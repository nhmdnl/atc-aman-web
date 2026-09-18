import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Github, Download } from "lucide-react";
import { SiteDisclaimer } from "@/components/site-disclaimer";
import {
  SITE_URL,
  POSITIONING,
  GITHUB_REPO,
  GITHUB_RELEASES,
  DISCLAIMER,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Press Kit",
  description:
    "Press kit for ATC Aman — offline Asmara (HHAS) air traffic control simulation for Windows. Boilerplate, links, and entertainment-only disclaimer.",
  alternates: { canonical: `${SITE_URL}/press` },
};

export default function PressPage() {
  return (
    <main className="min-h-screen bg-radar-bg text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-radar mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to ATC Aman
        </Link>

        <p className="font-mono text-xs text-radar tracking-widest mb-3">
          PRESS
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold mb-6">Press kit</h1>

        <h2 className="text-xl font-semibold mb-3">Boilerplate</h2>
        <p className="text-muted-foreground leading-relaxed mb-8">{POSITIONING}</p>

        <div className="rounded-xl border border-amber/30 bg-amber/5 p-4 mb-10">
          <p className="text-sm font-semibold text-amber mb-2">Required disclaimer</p>
          <SiteDisclaimer />
        </div>

        <h2 className="text-xl font-semibold mb-3">Fact sheet</h2>
        <ul className="text-sm text-muted-foreground space-y-2 mb-10 list-disc pl-5">
          <li>Genre: Air traffic control simulation / indie</li>
          <li>Platform: Windows (desktop download)</li>
          <li>Mode: Single-player, offline, no telemetry</li>
          <li>Setting: Asmara International Airport (HHAS), Eritrea</li>
          <li>Stations: Ground, Tower, Approach</li>
          <li>License: MIT (open source)</li>
          <li>Developer: Nahom Daniel Negash</li>
        </ul>

        <h2 className="text-xl font-semibold mb-3">Links</h2>
        <div className="flex flex-wrap gap-3 mb-10">
          <a
            href={GITHUB_RELEASES}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-radar text-radar-bg px-4 py-2 text-sm font-semibold"
          >
            <Download className="w-4 h-4" />
            Latest Windows release
          </a>
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-radar-border px-4 py-2 text-sm"
          >
            <Github className="w-4 h-4" />
            Source repo
          </a>
          <Link
            href="/airport/asmara-hhas"
            className="inline-flex items-center rounded-md border border-radar-border px-4 py-2 text-sm"
          >
            Airport page
          </Link>
        </div>

        <h2 className="text-xl font-semibold mb-3">Assets</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Screenshots, logo pack, and mute-safe trailer clips will be listed here.
          For now use OG image at{" "}
          <code className="font-mono text-radar">/og-image.png</code> and in-game
          captures from the developer.
        </p>

        <p className="mt-16 text-xs text-muted-foreground/60">{DISCLAIMER}</p>
      </div>
    </main>
  );
}
