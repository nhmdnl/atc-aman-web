import { DISCLAIMER } from "@/lib/site";

export function SiteDisclaimer({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs text-muted-foreground/70 leading-relaxed ${className}`}>
      {DISCLAIMER}
    </p>
  );
}
