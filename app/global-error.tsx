"use client";

import { useEffect } from "react";

/**
 * Last-resort screen when the whole layout fails. It replaces <html>, so it can't
 * rely on the site's fonts or styles: everything here is inline and minimal.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[city-escapes] fatal error", error.digest ?? "", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "grid",
          placeItems: "center",
          background: "#0e0d0b",
          color: "#ede6da",
          fontFamily: "Georgia, serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <main>
          <h1 style={{ fontWeight: 400, fontSize: "clamp(2rem, 5vw, 3.5rem)", margin: 0 }}>City Escapes</h1>
          <p style={{ color: "#b0a696", fontFamily: "system-ui, sans-serif", margin: "1rem 0 2rem" }}>
            The site couldn&apos;t load. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              background: "#b8935a",
              color: "#0e0d0b",
              border: 0,
              borderRadius: 999,
              padding: "0.8rem 1.6rem",
              fontFamily: "system-ui, sans-serif",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
