import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Plane, Mountain, Radio, ArrowLeft } from "lucide-react";
import { SiteDisclaimer } from "@/components/site-disclaimer";
import { SITE_URL, DISCLAIMER } from "@/lib/site";

export const metadata: Metadata = {
  title: "Asmara International Airport (HHAS) in ATC Aman",
  description:
    "Why ATC Aman is set at Asmara International Airport (HHAS / ASM): high-elevation field at 7,661 ft, runways 07/25 and 12/30, and a single-airport deep-sim focus. Entertainment simulation only.",
  alternates: { canonical: `${SITE_URL}/airport/asmara-hhas` },
  openGraph: {
    title: "Asmara International Airport (HHAS) — ATC Aman",
    description:
      "Explore the airport behind ATC Aman: Asmara (HHAS), Eritrea — elevation, runways, and why one airport makes a better sim.",
    url: `${SITE_URL}/airport/asmara-hhas`,
  },
};

const facts = [
  {
    icon: MapPin,
    label: "Codes",
    value: "ICAO HHAS · IATA ASM · Asmara, Eritrea",
  },
  {
    icon: Mountain,
    label: "Elevation",
    value: "7,661 ft (2,335 m) AMSL — high-elevation field",
  },
  {
    icon: Plane,
    label: "Primary runway",
    value: "07/25 · ~9,842 ft / 3,000 m · asphalt",
  },
  {
    icon: Plane,
    label: "Secondary runway",
    value: "12/30 · ~5,951 ft / 1,814 m · asphalt",
  },
  {
    icon: Radio,
    label: "Published freqs (public charts)",
    value: "Tower ~118.10 · Approach ~120.70 (simplified in-game)",
  },
];

export default function AsmaraAirportPage() {
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
          AIRPORT · HHAS
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold mb-6">
          Asmara International Airport
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-10">
          ATC Aman is a deep, single-airport simulation of{" "}
          <strong className="text-foreground">Asmara International (HHAS)</strong>
          — not a generic world map. One field, real-time Ground / Tower /
          Approach, built for players who care about aviation detail.
        </p>

        <div className="rounded-xl border border-radar-border bg-radar-surface p-4 mb-12">
          <SiteDisclaimer />
        </div>

        <h2 className="text-xl font-semibold mb-4">Field facts (public sources)</h2>
        <ul className="space-y-4 mb-12">
          {facts.map((f) => (
            <li
              key={f.label}
              className="flex gap-4 rounded-lg border border-radar-border bg-radar-surface/50 p-4"
            >
              <f.icon className="w-5 h-5 text-radar shrink-0 mt-0.5" />
              <div>
                <div className="text-sm text-muted-foreground">{f.label}</div>
                <div className="font-medium">{f.value}</div>
              </div>
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mb-4">Why Asmara?</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed mb-12">
          <p>
            Most ATC games spread thin across dozens of airports. ATC Aman goes
            the other way: one meaningful Eritrean airport with elevation,
            terrain, and procedure flavor that generic maps rarely capture.
          </p>
          <p>
            High field elevation changes how arrivals feel. Dual runways give
            sequencing choices. Diaspora players recognize HHAS immediately —
            and flight-sim fans get a place that is not another European hub
            clone.
          </p>
          <p className="text-sm">
            In-game frequencies, procedures, and layouts are{" "}
            <strong className="text-foreground">simplified for gameplay</strong>.
            Do not use ATC Aman for flight planning or real ATC.
          </p>
        </div>

        <h2 className="text-xl font-semibold mb-4">Sources</h2>
        <ul className="text-sm text-muted-foreground space-y-2 mb-12 list-disc pl-5">
          <li>
            <a
              className="text-radar hover:underline"
              href="https://skyvector.com/airport/HHAS/Asmara-Airport"
              target="_blank"
              rel="noopener noreferrer"
            >
              SkyVector — HHAS
            </a>
          </li>
          <li>
            <a
              className="text-radar hover:underline"
              href="https://skybrary.aero/airports/hhas"
              target="_blank"
              rel="noopener noreferrer"
            >
              SKYbrary — Asmara International
            </a>
          </li>
          <li>
            <a
              className="text-radar hover:underline"
              href="https://en.wikipedia.org/wiki/Asmara_International_Airport"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wikipedia — Asmara International Airport
            </a>
          </li>
        </ul>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/#download"
            className="inline-flex items-center rounded-md bg-radar text-radar-bg px-4 py-2 text-sm font-semibold hover:bg-radar-dim"
          >
            Download for Windows
          </Link>
          <Link
            href="/press"
            className="inline-flex items-center rounded-md border border-radar-border px-4 py-2 text-sm hover:bg-radar/10"
          >
            Press kit
          </Link>
        </div>

        <p className="mt-16 text-xs text-muted-foreground/60">{DISCLAIMER}</p>
      </div>
    </main>
  );
}
