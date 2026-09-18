export const SITE_URL = "https://atc-aman-web.vercel.app";

export const SITE_NAME = "ATC Aman";

export const DISCLAIMER =
  "ATC Aman is an entertainment simulation of air traffic control operations at Asmara International Airport (HHAS). It is not a training device, is not certified for any aviation purpose, and does not represent official procedures of any air navigation service provider.";

export const GITHUB_REPO = "https://github.com/nhmdnl/ATC-TS-Aman";
export const GITHUB_RELEASES = "https://github.com/nhmdnl/ATC-TS-Aman/releases/latest";

export const POSITIONING =
  "ATC Aman is a single-player, offline, real-time ATC simulation of Asmara International (HHAS)—built for aviation hobbyists and flight-sim fans who want deep control of one meaningful airport. Entertainment only. Not for training.";

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function buildRootJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description:
          "Free Windows air traffic control simulation of Asmara International Airport (HHAS), Eritrea.",
        publisher: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: "Nahom Daniel Negash",
        url: "https://github.com/nhmdnl",
        sameAs: ["https://github.com/nhmdnl", GITHUB_REPO],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#app`,
        name: SITE_NAME,
        applicationCategory: "GameApplication",
        applicationSubCategory: "Air Traffic Control Simulation",
        operatingSystem: "Windows",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        downloadUrl: GITHUB_RELEASES,
        url: SITE_URL,
        description: POSITIONING,
        author: { "@id": `${SITE_URL}/#person` },
      },
    ],
  };
}
