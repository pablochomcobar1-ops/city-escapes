/** Static film grain over the whole site. Pure SVG, no JS, no GPU cost after first paint. */
export function Grain() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] h-full w-full"
      style={{ opacity: "var(--ce-grain-opacity)" }}
    >
      <filter id="ce-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#ce-grain)" />
    </svg>
  );
}
