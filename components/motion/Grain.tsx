/**
 * Static film grain over the whole site: a small pre-made noise tile, repeated.
 * (A live SVG feTurbulence filter was used first; browsers re-render it on scroll,
 * it is costly on phones, and it occasionally composited at full strength.)
 */
export function Grain() {
  return (
    <div
      aria-hidden="true"
      data-grain
      className="pointer-events-none fixed inset-0 z-[90]"
      style={{
        opacity: "var(--ce-grain-opacity)",
        backgroundImage: "url(/media/grain.png)",
        backgroundSize: "128px 128px",
      }}
    />
  );
}
