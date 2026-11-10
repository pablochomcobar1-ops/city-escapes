"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Shown when something on a page crashes in the browser. Visitors get a calm way out;
 * the details go to the console (and to an error-tracking service, once one is set up).
 */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // `digest` matches the server log line without exposing the message to visitors.
    console.error("[city-escapes] page error", error.digest ?? "", error);
  }, [error]);

  return (
    <section aria-labelledby="err-title" className="mx-auto flex min-h-[80svh] max-w-site flex-col justify-center px-gutter pb-section pt-40">
      <p className="text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">Something went wrong</p>
      <h1 id="err-title" className="mt-6 max-w-3xl font-display text-hero02 text-foreground">
        A light <em className="text-brand">flickered.</em>
      </h1>
      <p className="mt-6 max-w-md text-body01 text-foreground-secondary">
        This part of the page didn&apos;t load properly. Trying again usually fixes it.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-6">
        <button
          type="button"
          onClick={reset}
          className="rounded-pill bg-brand px-6 py-3 text-caption01 font-medium tracking-[0.06em] text-background transition-opacity hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="text-caption01 font-medium tracking-[0.06em] text-foreground underline decoration-border underline-offset-[6px] hover:decoration-brand"
        >
          Back to the home page
        </Link>
      </div>
    </section>
  );
}
