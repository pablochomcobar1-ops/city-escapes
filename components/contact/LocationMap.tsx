/**
 * A hand-drawn, schematic map (no map API, no key, no tracking). Theme-aware via
 * currentColor and CSS variables. Concept location only.
 */
export function LocationMap() {
  return (
    <figure className="border border-border">
      <svg viewBox="0 0 400 300" role="img" aria-labelledby="map-title map-desc" className="block h-auto w-full">
        <title id="map-title">Location sketch of City Escapes</title>
        <desc id="map-desc">
          A schematic map: City Escapes sits just off SG Highway, which runs north towards Gandhinagar and south
          towards Sarkhej.
        </desc>
        {/* blocks */}
        <g fill="var(--ce-bg-2)" stroke="var(--ce-border)" strokeWidth="1">
          <rect x="40" y="30" width="90" height="70" />
          <rect x="40" y="120" width="70" height="60" />
          <rect x="250" y="40" width="110" height="60" />
          <rect x="270" y="190" width="90" height="80" />
          <rect x="30" y="210" width="110" height="60" />
        </g>
        {/* minor roads */}
        <g stroke="var(--ce-fg-subtle)" strokeWidth="1.5" fill="none" opacity="0.6">
          <path d="M0 110 H400" />
          <path d="M0 195 H400" />
          <path d="M150 0 V300" strokeDasharray="4 6" />
        </g>
        {/* SG Highway */}
        <path d="M215 0 L235 300" stroke="var(--ce-brand)" strokeWidth="6" fill="none" />
        <text x="244" y="150" fontSize="11" letterSpacing="2" fill="var(--ce-fg-2)" transform="rotate(86 244 150)">
          SG HIGHWAY
        </text>
        <text x="222" y="16" fontSize="10" fill="var(--ce-fg-subtle)">↑ Gandhinagar</text>
        <text x="244" y="292" fontSize="10" fill="var(--ce-fg-subtle)">↓ Sarkhej</text>
        {/* site */}
        <g transform="translate(185 150)">
          <circle r="22" fill="var(--ce-brand)" opacity="0.15" />
          <circle
            r="12"
            fill="var(--ce-brand)"
            className="animate-ping"
            style={{ transformBox: "fill-box", transformOrigin: "center", opacity: 0.25 }}
          />
          <rect x="-7" y="-14" width="6" height="22" fill="var(--ce-brand)" />
          <rect x="2" y="-10" width="6" height="18" fill="var(--ce-brand)" />
        </g>
        <text x="110" y="182" fontSize="12" fill="var(--ce-fg)" fontFamily="var(--font-display)">
          City Escapes
        </text>
      </svg>
      <figcaption className="flex items-center justify-between border-t border-border px-4 py-3 text-caption01 text-foreground-secondary">
        <span>Sample flat &amp; site office · SG Highway, Ahmedabad</span>
        <span className="text-foreground-subtle">Sketch, not to scale</span>
      </figcaption>
    </figure>
  );
}
