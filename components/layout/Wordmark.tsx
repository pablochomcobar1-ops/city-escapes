import Link from "next/link";

/** CE monogram + wordmark, drawn in code so it stays sharp at every size. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="City Escapes, home"
      className={`inline-flex items-center gap-3 text-foreground ${className}`}
    >
      <svg viewBox="0 0 32 32" className="size-7 text-brand" aria-hidden="true">
        <rect x="0.75" y="0.75" width="30.5" height="30.5" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M14 10.5a6 6 0 1 0 0 11" fill="none" stroke="currentColor" strokeWidth="1.25" />
        <path d="M23 10.5h-6v11h6M17 16h5" fill="none" stroke="currentColor" strokeWidth="1.25" />
      </svg>
      <span className="font-display text-[1.05rem] uppercase leading-none tracking-[0.28em]">
        City Escapes
      </span>
    </Link>
  );
}
