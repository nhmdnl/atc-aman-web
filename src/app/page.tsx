"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Radar,
  Radio,
  Plane,
  Shield,
  ShieldCheck,
  Gauge,
  MessageSquare,
  ClipboardCheck,
  Eye,
  Monitor,
  Keyboard,
  Volume2,
  Lock,
  Github,
  ExternalLink,
  ChevronDown,
  Play,
  Download,
  ArrowRight,
  Cpu,
  Zap,
  Gamepad2,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FeedbackSection } from "@/components/feedback-section";
import { IntroVideo } from "@/components/intro-video";
import { trackEvent } from "@/lib/analytics";
import { SiteDisclaimer } from "@/components/site-disclaimer";

/* ------------------------------------------------------------------ */
/*  Reusable animation wrapper                                        */
/* ------------------------------------------------------------------ */
function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const dirMap = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...dirMap[direction] }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Radar Scope (pure CSS / SVG hero visual)                          */
/* ------------------------------------------------------------------ */
function RadarScope() {
  return (
    <div className="relative w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] lg:w-[520px] lg:h-[520px]">
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-radar/5 blur-3xl" />

      {/* Range rings */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 500">
        {[1, 2, 3, 4].map((i) => (
          <circle
            key={i}
            cx="250"
            cy="250"
            r={60 * i}
            fill="none"
            stroke="rgba(0,255,136,0.12)"
            strokeWidth="1"
          />
        ))}
        {/* Cross hairs */}
        <line
          x1="250" y1="10" x2="250" y2="490"
          stroke="rgba(0,255,136,0.06)" strokeWidth="1"
        />
        <line
          x1="10" y1="250" x2="490" y2="250"
          stroke="rgba(0,255,136,0.06)" strokeWidth="1"
        />
        {/* Compass labels */}
        <text x="250" y="30" textAnchor="middle" fill="rgba(0,255,136,0.3)" fontSize="14" fontFamily="var(--font-geist-mono)">N</text>
        <text x="480" y="255" textAnchor="middle" fill="rgba(0,255,136,0.3)" fontSize="14" fontFamily="var(--font-geist-mono)">E</text>
        <text x="250" y="485" textAnchor="middle" fill="rgba(0,255,136,0.3)" fontSize="14" fontFamily="var(--font-geist-mono)">S</text>
        <text x="22" y="255" textAnchor="middle" fill="rgba(0,255,136,0.3)" fontSize="14" fontFamily="var(--font-geist-mono)">W</text>
        {/* Aircraft blips */}
        <circle cx="200" cy="160" r="3" fill="#00ff88" className="blink-slow" />
        <circle cx="320" cy="200" r="3" fill="#00ff88" className="blink-slow" style={{ animationDelay: "0.5s" }} />
        <circle cx="280" cy="350" r="3" fill="#f59e0b" className="blink-slow" style={{ animationDelay: "1s" }} />
        <circle cx="150" cy="300" r="3" fill="#00ff88" className="blink-slow" style={{ animationDelay: "1.5s" }} />
        <circle cx="370" cy="120" r="3" fill="#00ff88" className="blink-slow" style={{ animationDelay: "0.3s" }} />
        {/* Data blocks */}
        {[{ x: 200, y: 160, label: "ERI201", alt: false }, { x: 320, y: 200, label: "BAW744", alt: true }, { x: 280, y: 350, label: "ETH501", alt: false }].map((ac) => (
          <g key={ac.label}>
            <rect x={ac.x + 8} y={ac.y - 6} width="58" height="14" rx="2" fill="rgba(0,255,136,0.08)" stroke="rgba(0,255,136,0.2)" strokeWidth="0.5" />
            <text x={ac.x + 12} y={ac.y + 4} fill={ac.alt ? "#f59e0b" : "#00ff88"} fontSize="9" fontFamily="var(--font-geist-mono)" fontWeight="600">
              {ac.label}
            </text>
          </g>
        ))}
        {/* Airport symbol in center */}
        <circle cx="250" cy="250" r="6" fill="none" stroke="#00ff88" strokeWidth="1.5" />
        <circle cx="250" cy="250" r="2" fill="#00ff88" />
      </svg>

      {/* Rotating sweep line */}
      <div
        className="absolute inset-[15%] rounded-full radar-sweep"
        style={{
          background: "conic-gradient(from 0deg, transparent 0%, transparent 85%, rgba(0,255,136,0.25) 95%, rgba(0,255,136,0.5) 100%)",
        }}
      />

      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-radar radar-pulse" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Feature data                                                      */
/* ------------------------------------------------------------------ */

const stations = [
  {
    name: "Ground",
    code: "GND",
    icon: MapPin,
    color: "text-radar",
    borderColor: "border-radar/30",
    bgColor: "bg-radar/5",
    description:
      "Manage aircraft on the ground. Issue taxi clearances, coordinate pushback, and guide arrivals from the runway to their assigned gates with precision.",
    commands: ["Taxi to gate", "Hold position", "Pushback approved", "Follow (aircraft)"],
  },
  {
    name: "Tower",
    code: "TWR",
    icon: Radio,
    color: "text-amber",
    borderColor: "border-amber/30",
    bgColor: "bg-amber/5",
    description:
      "Clear aircraft for takeoff and landing. Monitor the active runway, manage separation, and ensure every aircraft operates safely in the critical zone.",
    commands: ["Cleared for takeoff", "Cleared to land", "Go around", "Line up and wait"],
  },
  {
    name: "Approach",
    code: "APP",
    icon: Plane,
    color: "text-[#38bdf8]",
    borderColor: "border-[#38bdf8]/30",
    bgColor: "bg-[#38bdf8]/5",
    description:
      "Sequence and vector arrivals through the terminal airspace. Guide aircraft from en-route down to the initial approach fix with proper spacing.",
    commands: ["Descend and maintain", "Turn heading", "Cleared ILS approach", "Reduce speed"],
  },
];

const scoringDimensions = [
  { name: "Safety", icon: Shield, description: "Separation, conflict prevention, and go-around usage" },
  { name: "Efficiency", icon: Gauge, description: "Throughput, fuel-saving descents, and minimal holding" },
  { name: "Communication", icon: MessageSquare, description: "Timely clearances, correct readbacks, phraseology" },
  { name: "Procedure", icon: ClipboardCheck, description: "Standard operating procedures, correct handoffs" },
  { name: "Awareness", icon: Eye, description: "Situational awareness, conflict detection, planning ahead" },
];

const techStack = [
  { name: "Electron 35", icon: Monitor, detail: "Desktop application" },
  { name: "TypeScript", icon: Cpu, detail: "Type-safe codebase" },
  { name: "React 19", icon: Zap, detail: "UI framework" },
  { name: "PixiJS 8", icon: Gamepad2, detail: "Radar rendering" },
  { name: "Vite 6", icon: Zap, detail: "Build tooling" },
  { name: "Vitest", icon: ClipboardCheck, detail: "Test suite" },
];

/* ------------------------------------------------------------------ */
/*  Release info type                                                 */
/* ------------------------------------------------------------------ */
interface ReleaseInfo {
  version: string;
  releaseName: string;
  releaseUrl: string;
  publishedAt: string;
  installer: {
    name: string;
    url: string;
    sizeBytes: number;
    sizeMB: string;
  } | null;
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */
export default function HomePage() {
  const [release, setRelease] = useState<ReleaseInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && !data.error) setRelease(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-radar-bg text-foreground overflow-x-hidden scanline-overlay grid-bg">
      {/* ======================== INTRO GREETING VIDEO ======================== */}
      <IntroVideo targetId="hero-content" />

      {/* ======================== NAV ======================== */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-radar-bg/70 border-b border-radar-border">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <Radar className="w-5 h-5 text-radar" />
            <span className="font-mono font-bold text-radar tracking-wider text-sm">
              ATC AMAN
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
            <a
              href="#intro"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("intro")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover:text-radar transition-colors flex items-center gap-1.5"
            >
              <Play className="w-3 h-3 text-radar" />
              Intro
            </a>
            <a href="#features" className="hover:text-radar transition-colors">
              Features
            </a>
            <a href="#stations" className="hover:text-radar transition-colors">
              Stations
            </a>
            <a href="#scoring" className="hover:text-radar transition-colors">
              Scoring
            </a>
            <a href="#tech" className="hover:text-radar transition-colors">
              Tech
            </a>
            <a href="#download" className="hover:text-radar transition-colors">
              Download
            </a>
            <a href="/airport/asmara-hhas" className="hover:text-radar transition-colors">
              Airport
            </a>
            <a href="/press" className="hover:text-radar transition-colors">
              Press
            </a>
            <a href="#feedback" className="hover:text-radar transition-colors">
              Feedback
            </a>
          </div>
          <a
            href="https://github.com/nhmdnl/ATC-TS-Aman"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="sm"
              className="border-radar-border text-radar hover:bg-radar/10 hover:text-radar gap-2"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </Button>
          </a>
        </nav>
      </header>

      {/* ======================== HERO ======================== */}
      <section
        id="hero-content"
        className="relative flex-1 flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 min-h-[100vh]"
      >
        <FadeIn delay={0.1}>
          <Badge
            variant="outline"
            className="mb-6 border-radar/30 text-radar bg-radar/5 font-mono text-xs tracking-wider"
          >
            <MapPin className="w-3 h-3 mr-1.5" />
            HHAS — ASMARA INTERNATIONAL AIRPORT, ERITREA
          </Badge>
        </FadeIn>

        <FadeIn delay={0.25}>
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-extrabold tracking-tight mb-6">
            <span className="text-foreground">ATC </span>
            <span className="text-radar text-glow">Aman</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.4}>
          <p className="max-w-xl text-lg sm:text-xl text-muted-foreground leading-relaxed mb-4">
            Sit in the tower at Asmara. Work arrivals and departures across
            <span className="text-radar"> Ground</span>,
            <span className="text-amber"> Tower</span>, and
            <span className="text-[#38bdf8]"> Approach</span> — by clicking aircraft
            on the radar and issuing commands, exactly the way a real shift never
            quite goes.
          </p>
        </FadeIn>

        <FadeIn delay={0.5}>
          <p className="text-sm text-muted-foreground/60 font-mono mb-10">
            A single-player, real-time air traffic control simulation
          </p>
        </FadeIn>

        <FadeIn delay={0.6}>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            {release?.installer ? (
              <a
                href={release.installer.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("download_click", {
                    location: "hero",
                    version: release.version,
                    size_mb: release.installer.sizeMB,
                  })
                }
              >
                <Button
                  size="lg"
                  className="bg-radar text-radar-bg hover:bg-radar-dim font-bold gap-2 px-8"
                >
                  <Download className="w-5 h-5" />
                  Download {release.version}
                  <span className="text-radar-bg/60 font-normal text-sm">
                    ({release.installer.sizeMB} MB)
                  </span>
                </Button>
              </a>
            ) : (
              <a
                href="https://github.com/nhmdnl/ATC-TS-Aman/releases/latest"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-radar text-radar-bg hover:bg-radar-dim font-bold gap-2 px-8"
                >
                  <Download className="w-5 h-5" />
                  Download Latest
                </Button>
              </a>
            )}
            <a
              href="https://github.com/nhmdnl/ATC-TS-Aman"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("github_click", { location: "hero" })}
            >
              <Button
                variant="outline"
                size="lg"
                className="border-radar-border text-radar hover:bg-radar/10 gap-2 px-8"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </Button>
            </a>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => {
                document.getElementById("intro")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-muted-foreground hover:text-radar hover:bg-radar/10 gap-2 px-6"
            >
              <Play className="w-4 h-4 text-radar" />
              Watch Intro
            </Button>
          </div>
        </FadeIn>

        {/* Radar scope visual */}
        <FadeIn delay={0.8} className="absolute bottom-4 right-0 opacity-30 pointer-events-none hidden lg:block">
          <RadarScope />
        </FadeIn>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground/40" />
        </motion.div>
      </section>

      {/* ======================== FEATURES ======================== */}
      <section id="features" className="relative py-24 sm:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-radar/30 text-radar bg-radar/5 font-mono text-xs">
              FEATURES
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              Built for <span className="text-radar text-glow">immersion</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Every detail is crafted to recreate the tension, focus, and
              satisfaction of real air traffic control — from ICAO phraseology
              to the sweep of the radar.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Plane,
                title: "Full Flight Lifecycle",
                desc: "Aircraft spawn, approach, land, taxi, gate — or pushback, takeoff, and depart. Every phase is simulated in real time from initial contact to handoff.",
              },
              {
                icon: Monitor,
                title: "PixiJS Radar Scope",
                desc: "Real airport diagram with range rings, data blocks, position trails, zoom/pan, and a ruler tool. The scope feels like the real thing.",
              },
              {
                icon: Volume2,
                title: "Spoken ATC Audio",
                desc: "Offline text-to-speech delivers ICAO phraseology for both controller commands and pilot readbacks. Captions always available for silent play.",
              },
              {
                icon: Gamepad2,
                title: "Play Your Stations",
                desc: "Hand any station to a deterministic AI controller and keep the ones you enjoy. Only the aircraft under your control are scored.",
              },
              {
                icon: Gauge,
                title: "Difficulty Presets",
                desc: "From relaxed to overwhelming. Adjust traffic density and complexity to match your skill level. Pause anytime, use keyboard shortcuts for speed.",
              },
              {
                icon: Keyboard,
                title: "Command Input",
                desc: "Click command buttons or type commands in the text input for purists. Full keyboard control with shortcuts for every action.",
              },
            ].map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.08}>
                <Card className="h-full bg-radar-surface border-radar-border hover:border-radar/30 transition-colors group">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-lg bg-radar/10 flex items-center justify-center mb-4 group-hover:bg-radar/20 transition-colors">
                      <f.icon className="w-5 h-5 text-radar" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {f.desc}
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== STATIONS ======================== */}
      <section id="stations" className="relative py-24 sm:py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-radar/3 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-radar/30 text-radar bg-radar/5 font-mono text-xs">
              CONTROLLER STATIONS
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              Three stations. <span className="text-radar text-glow">One mission.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Each station has its own command set, responsibilities, and
              challenges. Master them all or delegate to AI and focus on what
              you love.
            </p>
          </FadeIn>

          <div className="grid lg:grid-cols-3 gap-6">
            {stations.map((s, i) => (
              <FadeIn key={s.code} delay={i * 0.12}>
                <Card
                  className={`h-full bg-radar-surface ${s.borderColor} border-2 hover:border-opacity-60 transition-all group`}
                >
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl ${s.bgColor} flex items-center justify-center`}>
                        <s.icon className={`w-6 h-6 ${s.color}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl">{s.name}</h3>
                        <span className={`font-mono text-sm ${s.color}`}>
                          {s.code}
                        </span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      {s.description}
                    </p>
                    <div className="space-y-2">
                      <p className="text-xs font-mono text-muted-foreground/60 uppercase tracking-wider">
                        Sample Commands
                      </p>
                      {s.commands.map((cmd) => (
                        <div
                          key={cmd}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${s.color.replace('text-', 'bg-')}`} />
                          <span className="font-mono text-muted-foreground">
                            {cmd}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== SCORING ======================== */}
      <section id="scoring" className="relative py-24 sm:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-amber/30 text-amber bg-amber/5 font-mono text-xs">
              SCORING SYSTEM
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              Five dimensions. <span className="text-amber text-glow-amber">S to D grades.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Your performance is measured across five key areas, each graded
              from S (exceptional) to D. Build XP, level up, and track your
              career progression across sessions.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {scoringDimensions.map((d, i) => (
              <FadeIn key={d.name} delay={i * 0.08}>
                <Card className="h-full bg-radar-surface border-radar-border hover:border-amber/30 transition-colors group text-center">
                  <CardContent className="p-5 flex flex-col items-center">
                    <div className="w-11 h-11 rounded-full bg-amber/10 flex items-center justify-center mb-3 group-hover:bg-amber/20 transition-colors">
                      <d.icon className="w-5 h-5 text-amber" />
                    </div>
                    <h3 className="font-semibold mb-1.5">{d.name}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {d.description}
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== TECH ======================== */}
      <section id="tech" className="relative py-24 sm:py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-radar/3 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-[#38bdf8]/30 text-[#38bdf8] bg-[#38bdf8]/5 font-mono text-xs">
              TECHNOLOGY
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              Modern stack. <span className="text-[#38bdf8]">Native performance.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Built with the latest tools for a fast, responsive, and beautiful
              desktop experience.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {techStack.map((t) => (
                <Card key={t.name} className="bg-radar-surface border-radar-border hover:border-[#38bdf8]/30 transition-colors group">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#38bdf8]/10 flex items-center justify-center group-hover:bg-[#38bdf8]/20 transition-colors">
                      <t.icon className="w-5 h-5 text-[#38bdf8]" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{t.name}</h3>
                      <p className="text-muted-foreground text-sm">{t.detail}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.3} className="mt-12">
            <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-sm text-muted-foreground">
              <span className="text-radar/60">Language breakdown:</span>
              <Badge variant="outline" className="border-radar-border bg-radar-surface">
                TypeScript 98.5%
              </Badge>
              <Badge variant="outline" className="border-radar-border bg-radar-surface">
                JavaScript 1.3%
              </Badge>
              <Badge variant="outline" className="border-radar-border bg-radar-surface">
                CSS 0.2%
              </Badge>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ======================== DOWNLOAD ======================== */}
      <section id="download" className="relative py-24 sm:py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-radar/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-radar/30 text-radar bg-radar/5 font-mono text-xs">
              DOWNLOAD
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              Install and <span className="text-radar text-glow">fly</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Download the Windows installer and start controlling traffic at Asmara
              International Airport in minutes. No account required.
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <Card className="bg-radar-surface border-radar-border overflow-hidden">
              <CardContent className="p-8 sm:p-12">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-radar/30 border-t-radar animate-spin" />
                    <p className="text-muted-foreground text-sm font-mono">
                      Fetching latest release...
                    </p>
                  </div>
                ) : release && release.installer ? (
                  <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="w-20 h-20 rounded-2xl bg-radar/10 border border-radar/20 flex items-center justify-center shrink-0">
                      <Download className="w-9 h-9 text-radar" />
                    </div>
                    <div className="flex-1 text-center sm:text-left space-y-2">
                      <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                        <h3 className="text-xl font-bold">
                          ATC Aman {release.version}
                        </h3>
                        <Badge className="bg-radar/15 text-radar border-radar/20 text-xs font-mono">
                          Latest
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="font-mono">{release.installer.name}</span>
                        <span className="text-muted-foreground/40">|</span>
                        <span>{release.installer.sizeMB} MB</span>
                        <span className="text-muted-foreground/40">|</span>
                        <span>Windows Installer (.exe)</span>
                      </div>
                      <p className="text-xs text-muted-foreground/50 font-mono">
                        Published {new Date(release.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <a
                      href={release.installer.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackEvent("download_click", {
                          location: "download_section",
                          version: release.version,
                          size_mb: release.installer.sizeMB,
                        })
                      }
                    >
                      <Button
                        size="lg"
                        className="bg-radar text-radar-bg hover:bg-radar-dim font-bold gap-2 px-8 h-14 text-base shrink-0"
                      >
                        <Download className="w-5 h-5" />
                        Download .exe
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-radar/10 border border-radar/20 flex items-center justify-center">
                      <Download className="w-7 h-7 text-radar" />
                    </div>
                    <h3 className="text-lg font-semibold">Windows Installer</h3>
                    <p className="text-muted-foreground text-sm text-center max-w-md">
                      Grab the latest Windows installer directly from GitHub Releases.
                    </p>
                    <a
                      href="https://github.com/nhmdnl/ATC-TS-Aman/releases/latest"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="lg"
                        className="bg-radar text-radar-bg hover:bg-radar-dim font-bold gap-2 px-8 h-12"
                      >
                        <ExternalLink className="w-5 h-5" />
                        Open Releases on GitHub
                      </Button>
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.25} className="mt-6 text-center">
            <a
              href="https://github.com/nhmdnl/ATC-TS-Aman/releases/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-radar transition-colors font-mono"
            >
              View all releases
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </FadeIn>
        </div>
      </section>

      {/* ======================== PRIVACY ======================== */}
      <section className="relative py-24 sm:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <Card className="bg-radar-surface border-radar-border overflow-hidden">
              <CardContent className="p-8 sm:p-12">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-radar/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-7 h-7 text-radar" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Lock className="w-4 h-4 text-radar" />
                      <h2 className="text-2xl sm:text-3xl font-bold">
                        Privacy First. Always.
                      </h2>
                    </div>
                    <div className="space-y-3 text-muted-foreground leading-relaxed">
                      <p>
                        <span className="text-radar font-semibold">No data collection.</span> No telemetry, no analytics, no network calls — ever.
                        ATC Aman is a fully offline application. All your progress,
                        scores, and career XP are stored locally on your machine and
                        never leave it.
                      </p>
                      <p>
                        There are no accounts, no servers, no phone-home mechanisms.
                        You install it, you play it, and your data stays yours.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {[
                        "No telemetry",
                        "No analytics",
                        "No network calls",
                        "Local storage only",
                        "MIT License",
                      ].map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="border-radar/20 text-radar/80 bg-radar/5 text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>

      {/* ======================== DISCLAIMER ======================== */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <Card className="bg-amber/5 border-amber/20">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Shield className="w-5 h-5 text-amber" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber mb-2">
                      Simulation Only
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      ATC Aman is a game. It is not suitable for real-world
                      aviation, navigation, flight planning, or ATC training.
                      Procedures, frequencies, and airport data are simplified
                      and may be inaccurate or out of date.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>

      {/* ======================== FEEDBACK ======================== */}
      <FeedbackSection />

      {/* ======================== CTA ======================== */}
      <section className="relative py-24 sm:py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-t from-radar/5 to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <FadeIn>
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
              Ready to take the <span className="text-radar text-glow">tower</span>?
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Clone the repo, install dependencies, and start your first shift at
              Asmara International Airport. Open source under MIT license.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {release?.installer ? (
                <a
                  href={release.installer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("download_click", {
                      location: "final_cta",
                      version: release.version,
                      size_mb: release.installer.sizeMB,
                    })
                  }
                >
                  <Button
                    size="lg"
                    className="bg-radar text-radar-bg hover:bg-radar-dim font-bold gap-2 px-10 text-lg h-14"
                  >
                    <Download className="w-6 h-6" />
                    Download {release.version} for Windows
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </a>
              ) : (
                <a
                  href="https://github.com/nhmdnl/ATC-TS-Aman/releases/latest"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("download_click", {
                      location: "final_cta",
                      version: "latest",
                    })
                  }
                >
                  <Button
                    size="lg"
                    className="bg-radar text-radar-bg hover:bg-radar-dim font-bold gap-2 px-10 text-lg h-14"
                  >
                    <Download className="w-6 h-6" />
                    Download Latest
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </a>
              )}
              <a
                href="https://github.com/nhmdnl/ATC-TS-Aman"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("github_click", { location: "final_cta" })}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="border-radar-border text-radar hover:bg-radar/10 gap-2 px-10 text-lg h-14"
                >
                  <Github className="w-5 h-5" />
                  Star on GitHub
                </Button>
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.35} className="mt-8">
            <code className="font-mono text-sm text-muted-foreground/60 bg-radar-surface border border-radar-border rounded-lg px-4 py-2 inline-block">
              $ git clone https://github.com/nhmdnl/ATC-TS-Aman.git && cd ATC-TS-Aman && npm install && npm run dev
            </code>
          </FadeIn>
        </div>
      </section>

      {/* ======================== FOOTER ======================== */}
      <footer className="border-t border-radar-border py-10 px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          <SiteDisclaimer className="max-w-3xl" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Radar className="w-4 h-4 text-radar/60" />
              <span className="font-mono">ATC Aman</span>
              <span className="text-muted-foreground/40">|</span>
              <span>MIT License</span>
              <span className="text-muted-foreground/40">|</span>
              <a href="/airport/asmara-hhas" className="hover:text-radar transition-colors">Airport</a>
              <a href="/press" className="hover:text-radar transition-colors">Press</a>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>By Nahom Daniel Negash</span>
              <a
                href="https://github.com/nhmdnl/ATC-TS-Aman"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-radar transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
