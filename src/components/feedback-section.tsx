"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import {
  Bug,
  Lightbulb,
  MessageSquare,
  Send,
  ExternalLink,
  Github,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ChevronDown,
  User,
  ArrowUpRight,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface FeedbackItem {
  id: number;
  number: number;
  title: string;
  body: string;
  url: string;
  type: "bug" | "feature" | "feedback" | "question";
  state: string;
  author: {
    username: string;
    avatar: string;
    profileUrl: string;
  };
  createdAt: string;
  commentCount: number;
  labels: { name: string; color: string }[];
}

type FeedbackType = "bug" | "feature" | "feedback";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const TYPE_CONFIG: Record<
  FeedbackType,
  { label: string; icon: typeof Bug; color: string; borderColor: string; bgColor: string; badgeClass: string }
> = {
  bug: {
    label: "Bug Report",
    icon: Bug,
    color: "text-red-400",
    borderColor: "border-red-400/30",
    bgColor: "bg-red-400/10",
    badgeClass: "bg-red-400/15 text-red-400 border-red-400/20",
  },
  feature: {
    label: "Feature Request",
    icon: Lightbulb,
    color: "text-[#38bdf8]",
    borderColor: "border-[#38bdf8]/30",
    bgColor: "bg-[#38bdf8]/10",
    badgeClass: "bg-[#38bdf8]/15 text-[#38bdf8] border-[#38bdf8]/20",
  },
  feedback: {
    label: "General Feedback",
    icon: MessageSquare,
    color: "text-radar",
    borderColor: "border-radar/30",
    bgColor: "bg-radar/10",
    badgeClass: "bg-radar/15 text-radar border-radar/20",
  },
};

const TYPE_DISPLAY: Record<string, { color: string; icon: typeof Bug }> = {
  bug: { color: "text-red-400", icon: Bug },
  feature: { color: "text-[#38bdf8]", icon: Lightbulb },
  feedback: { color: "text-radar", icon: MessageSquare },
  question: { color: "text-amber", icon: MessageSquare },
};

/* ------------------------------------------------------------------ */
/*  FadeIn helper                                                      */
/* ------------------------------------------------------------------ */
function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Time ago helper                                                    */
/* ------------------------------------------------------------------ */
function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

/* ------------------------------------------------------------------ */
/*  Feedback Form                                                      */
/* ------------------------------------------------------------------ */
function FeedbackForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [type, setType] = useState<FeedbackType>("feedback");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    issueUrl?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, title, body, authorName }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setResult({
          success: true,
          message: data.message,
          issueUrl: data.issueUrl,
        });
        setTitle("");
        setBody("");
        onSubmitted();
      } else {
        setResult({
          success: false,
          message: data.error || "Something went wrong",
        });
      }
    } catch {
      setResult({
        success: false,
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const config = TYPE_CONFIG[type];
  const Icon = config.icon;

  return (
    <Card className="bg-radar-surface border-radar-border overflow-hidden">
      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type selector */}
          <div>
            <label className="text-sm font-medium mb-3 block">What kind of feedback?</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(TYPE_CONFIG) as [FeedbackType, typeof TYPE_CONFIG[FeedbackType]][]).map(
                ([key, cfg]) => {
                  const TypeIcon = cfg.icon;
                  const isSelected = type === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setType(key)}
                      className={`
                        flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all text-center
                        ${
                          isSelected
                            ? `${cfg.borderColor} ${cfg.bgColor}`
                            : "border-radar-border hover:border-radar/30"
                        }
                      `}
                    >
                      <TypeIcon className={`w-5 h-5 ${isSelected ? cfg.color : "text-muted-foreground"}`} />
                      <span
                        className={`text-xs font-medium ${isSelected ? cfg.color : "text-muted-foreground"}`}
                      >
                        {cfg.label}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="fb-title" className="text-sm font-medium mb-2 block">
              Title <span className="text-muted-foreground/50">(brief summary)</span>
            </label>
            <Input
              id="fb-title"
              placeholder="e.g. Aircraft disappear at low altitude"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={5}
              maxLength={120}
              className="bg-radar-bg border-radar-border text-foreground placeholder:text-muted-foreground/40 focus:border-radar/50"
            />
          </div>

          {/* Body */}
          <div>
            <label htmlFor="fb-body" className="text-sm font-medium mb-2 block">
              Details <span className="text-muted-foreground/50">(describe what happened or what you'd like)</span>
            </label>
            <Textarea
              id="fb-body"
              placeholder="Provide as much detail as possible — what you were doing, what you expected, what actually happened..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              minLength={10}
              maxLength={2000}
              rows={5}
              className="bg-radar-bg border-radar-border text-foreground placeholder:text-muted-foreground/40 focus:border-radar/50 resize-none"
            />
            <p className="text-xs text-muted-foreground/40 mt-1 text-right font-mono">
              {body.length}/2000
            </p>
          </div>

          {/* Author name (optional) */}
          <div>
            <label htmlFor="fb-author" className="text-sm font-medium mb-2 block">
              Your name <span className="text-muted-foreground/50">(optional — defaults to Anonymous)</span>
            </label>
            <Input
              id="fb-author"
              placeholder="Anonymous"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              maxLength={50}
              className="bg-radar-bg border-radar-border text-foreground placeholder:text-muted-foreground/40 focus:border-radar/50"
            />
          </div>

          {/* Result message */}
          {result && (
            <div
              className={`flex items-start gap-3 p-4 rounded-lg border ${
                result.success
                  ? "bg-radar/5 border-radar/20"
                  : "bg-red-400/5 border-red-400/20"
              }`}
            >
              {result.success ? (
                <CheckCircle2 className="w-5 h-5 text-radar shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`text-sm font-medium ${result.success ? "text-radar" : "text-red-400"}`}>
                  {result.success ? "Feedback submitted!" : "Submission failed"}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {result.message}
                </p>
                {result.issueUrl && (
                  <a
                    href={result.issueUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-radar hover:underline mt-2"
                  >
                    View issue on GitHub
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={submitting || !title || !body}
            className={`w-full ${config.bgColor} ${config.color} ${config.borderColor} border-2 font-bold gap-2 h-12 disabled:opacity-40 disabled:cursor-not-allowed hover:${config.bgColor.replace('/10', '/20')}`}
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            {submitting ? "Submitting..." : `Submit ${config.label}`}
          </Button>

          <p className="text-xs text-muted-foreground/40 text-center">
            Your feedback is posted as a GitHub Issue for full transparency.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Feedback List                                                      */
/* ------------------------------------------------------------------ */
function FeedbackList({ items, loading }: { items: FeedbackItem[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 rounded-lg bg-radar-surface border border-radar-border animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="bg-radar-surface border-radar-border">
        <CardContent className="p-8 text-center">
          <MessageSquare className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No feedback yet. Be the first!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const typeDisplay = TYPE_DISPLAY[item.type] || TYPE_DISPLAY.feedback;
        const TypeIcon = typeDisplay.icon;
        return (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <Card className="bg-radar-surface border-radar-border hover:border-radar/30 transition-all">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <img
                    src={item.author.avatar}
                    alt={item.author.username}
                    className="w-8 h-8 rounded-full mt-0.5 shrink-0 bg-radar-border"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-medium text-foreground group-hover:text-radar transition-colors truncate">
                        {item.title}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 h-5 font-mono ${typeDisplay.color.replace('text-', 'text-')} ${typeDisplay.color.replace('text-', 'border-')}/20 bg-radar-bg`}
                      >
                        <TypeIcon className="w-3 h-3 mr-0.5" />
                        {item.type}
                      </Badge>
                      {item.state === "closed" && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 font-mono text-muted-foreground/60 border-muted-foreground/20">
                          closed
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground/60">
                      <span className="font-mono">@{item.author.username}</span>
                      <span>{timeAgo(item.createdAt)}</span>
                      {item.commentCount > 0 && (
                        <span className="font-mono">{item.commentCount} comment{item.commentCount > 1 ? "s" : ""}</span>
                      )}
                      <span className="font-mono">#{item.number}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-radar/50 transition-colors shrink-0 mt-1" />
                </div>
              </CardContent>
            </Card>
          </a>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Feedback Section (exported)                                   */
/* ------------------------------------------------------------------ */
export function FeedbackSection() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchIssues = useCallback(async () => {
    try {
      const res = await fetch("/api/issues");
      if (res.ok) {
        const data = await res.json();
        setFeedback(data.feedback || []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues, refreshKey]);

  const refreshAfterSubmit = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <section id="feedback" className="relative py-24 sm:py-32 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-radar/3 to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        <FadeIn className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-radar/30 text-radar bg-radar/5 font-mono text-xs">
            COMMUNITY
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-bold mb-4">
            Feedback & <span className="text-radar text-glow">Discussion</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Found a bug? Have a feature idea? Share your thoughts — every submission
            becomes a GitHub Issue for full transparency and community tracking.
          </p>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Recent Feedback */}
          <div>
            <FadeIn delay={0.1}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Recent Feedback</h3>
                <a
                  href="https://github.com/nhmdnl/ATC-TS-Aman/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-radar transition-colors inline-flex items-center gap-1 font-mono"
                >
                  View all
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <FeedbackList items={feedback} loading={loading} />
            </FadeIn>
          </div>

          {/* Right: Submit Feedback Form */}
          <div>
            <FadeIn delay={0.2}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Submit Feedback</h3>
              </div>
            </FadeIn>
            <FadeIn delay={0.25}>
              {showForm ? (
                <FeedbackForm onSubmitted={refreshAfterSubmit} />
              ) : (
                <Card className="bg-radar-surface border-radar-border overflow-hidden">
                  <CardContent className="p-8 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-radar/10 border border-radar/20 flex items-center justify-center mx-auto mb-4">
                      <Send className="w-6 h-6 text-radar" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      Share Your Thoughts
                    </h3>
                    <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                      Your feedback is posted publicly as a GitHub Issue so everyone
                      can see, discuss, and track progress.
                    </p>
                    <Button
                      onClick={() => setShowForm(true)}
                      className="bg-radar text-radar-bg hover:bg-radar-dim font-bold gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Open Feedback Form
                    </Button>
                  </CardContent>
                </Card>
              )}
            </FadeIn>
          </div>
        </div>

        {/* GitHub link */}
        <FadeIn delay={0.3} className="mt-8 text-center">
          <p className="text-sm text-muted-foreground/50">
            Prefer GitHub directly?{" "}
            <a
              href="https://github.com/nhmdnl/ATC-TS-Aman/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-radar/70 hover:text-radar transition-colors inline-flex items-center gap-1 font-mono"
            >
              Create an issue on GitHub
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
