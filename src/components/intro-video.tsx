"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  VolumeX,
  ChevronDown,
  Play,
  RotateCcw,
  Radio,
  Radar,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface IntroVideoProps {
  videoSrc?: string;
  targetId?: string;
  autoScrollDelayMs?: number;
}

export function IntroVideo({
  videoSrc = "/intro.mp4",
  targetId = "hero-content",
  autoScrollDelayMs = 600,
}: IntroVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [hasScrolledPast, setHasScrolledPast] = useState(false);

  // Smooth scroll to the main content
  const scrollToContent = useCallback(() => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  }, [targetId]);

  // Handle video end: auto-scroll after a brief delay
  const handleEnded = useCallback(() => {
    setHasEnded(true);
    setIsPlaying(false);
    setTimeout(() => {
      scrollToContent();
    }, autoScrollDelayMs);
  }, [scrollToContent, autoScrollDelayMs]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  }, []);

  // Replay video
  const handleReplay = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasEnded(false);
        })
        .catch(() => {});
    } else {
      setHasEnded(false);
      setProgress(0);
    }
  }, []);

  // Update progress
  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration;
      setCurrentTime(cur);
      if (dur > 0) {
        setDuration(dur);
        setProgress((cur / dur) * 100);
      }
    }
  }, []);

  // Intersection observer: pause when scrolled out of view to save resources
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setHasScrolledPast(!isVisible && entry.boundingClientRect.top < 0);

        if (videoRef.current) {
          if (isVisible && !hasEnded) {
            videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [hasEnded]);

  // Listen to wheel/key down on intro to support intuitive "scroll to skip"
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // If user scrolls down while viewing the intro
      if (e.deltaY > 20 && window.scrollY < 100) {
        scrollToContent();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") &&
        window.scrollY < 100
      ) {
        e.preventDefault();
        scrollToContent();
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [scrollToContent]);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <section
      ref={containerRef}
      id="intro"
      className="relative w-full h-[100vh] min-h-[580px] flex flex-col justify-between items-center bg-[#070b14] overflow-hidden select-none border-b border-radar/20"
    >
      {/* Background Ambience / Scanlines */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,255,136,0.04)_0%,transparent_70%)]" />
      <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] opacity-40" />

      {/* Top Bar Overlay (spaced below fixed nav) */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-6 pt-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-radar/30 text-radar bg-radar/10 font-mono text-xs px-3 py-1 flex items-center gap-1.5"
          >
            <Radio className="w-3 h-3 text-radar animate-pulse" />
            <span>HHAS TOWER // INCOMING TRANSMISSION</span>
          </Badge>
        </div>

        {/* Audio Toggle Button */}
        {!videoError && (
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAudio}
            className="border-radar/30 bg-radar-bg/80 backdrop-blur-md text-radar hover:bg-radar/15 hover:text-radar gap-2 text-xs font-mono transition-all"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-radar/60" />
                <span>UNMUTE AUDIO</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-radar" />
                <span className="text-radar font-semibold">AUDIO ON</span>
              </>
            )}
          </Button>
        )}
      </div>

      {/* Center Video Canvas / Fallback Area */}
      <div className="relative z-0 w-full h-full flex items-center justify-center">
        {!videoError ? (
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            playsInline
            muted={isMuted}
            onEnded={handleEnded}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover sm:object-contain max-h-[85vh]"
          />
        ) : (
          /* Cinematic Radar Fallback when no MP4 file is found */
          <div className="relative flex flex-col items-center justify-center text-center px-6 max-w-xl">
            {/* Animated Radar Visual */}
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-radar/20" />
              <div className="absolute inset-8 rounded-full border border-radar/15" />
              <div className="absolute inset-16 rounded-full border border-radar/10" />
              <div className="absolute w-full h-px bg-radar/15" />
              <div className="absolute h-full w-px bg-radar/15" />

              {/* Rotating Sweep Beam */}
              <div
                className="absolute inset-0 rounded-full radar-sweep"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0%, transparent 80%, rgba(0,255,136,0.2) 95%, rgba(0,255,136,0.6) 100%)",
                }}
              />

              {/* Center Radar Icon */}
              <div className="relative z-10 w-16 h-16 rounded-full bg-radar/10 border border-radar/30 flex items-center justify-center">
                <Radar className="w-8 h-8 text-radar animate-pulse" />
              </div>

              {/* Simulated aircraft blips */}
              <div className="absolute top-12 right-16 w-2 h-2 rounded-full bg-radar animate-ping" />
              <div className="absolute bottom-16 left-12 w-2 h-2 rounded-full bg-[#38bdf8]" />
            </div>

            <Badge
              variant="outline"
              className="mb-3 border-amber/30 text-amber bg-amber/5 font-mono text-xs"
            >
              INTRO BRIEFING PREVIEW
            </Badge>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-2">
              Welcome to <span className="text-radar text-glow">Asmara Control</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mb-6 leading-relaxed">
              Place your custom greeting video at{" "}
              <code className="text-radar font-mono text-xs bg-radar/10 px-2 py-0.5 rounded">
                public/intro.mp4
              </code>{" "}
              to play it automatically.
            </p>

            <Button
              onClick={scrollToContent}
              className="bg-radar text-radar-bg hover:bg-radar-dim font-bold gap-2 text-sm px-6"
            >
              Enter Airspace
              <ArrowDown className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-6 pb-6 flex flex-col gap-4">
        {/* Progress Bar */}
        {!videoError && duration > 0 && (
          <div className="w-full flex items-center gap-3">
            <span className="font-mono text-xs text-muted-foreground/60 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 h-1 bg-radar/15 rounded-full overflow-hidden relative cursor-pointer">
              <div
                className="h-full bg-radar rounded-full transition-all duration-150 shadow-[0_0_8px_#00ff88]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-mono text-xs text-muted-foreground/60 w-10">
              {formatTime(duration)}
            </span>
          </div>
        )}

        {/* Bottom Actions: Replay / Skip & Scroll Indicator */}
        <div className="flex items-center justify-between w-full">
          <div className="w-24">
            {hasEnded && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReplay}
                className="text-muted-foreground hover:text-radar gap-1.5 text-xs font-mono"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Replay
              </Button>
            )}
          </div>

          {/* Central Skip / Scroll Prompt */}
          <button
            onClick={scrollToContent}
            className="group flex flex-col items-center gap-1.5 text-xs font-mono text-muted-foreground/80 hover:text-radar transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-radar/10 border border-radar/20 group-hover:border-radar/40 group-hover:bg-radar/15 transition-all">
              <span>{hasEnded ? "Explore ATC Aman" : "Skip Intro"}</span>
              <ChevronDown className="w-3.5 h-3.5 text-radar group-hover:translate-y-0.5 transition-transform" />
            </div>
            <span className="text-[10px] text-muted-foreground/50 tracking-wider">
              OR SCROLL DOWN
            </span>
          </button>

          <div className="w-24 text-right">
            <span className="font-mono text-[11px] text-muted-foreground/40 hidden sm:inline">
              HHAS 118.30 MHz
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
