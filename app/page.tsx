// Temporary token preview. Replaced by the real home page in Task 5.
const swatches = [
  ["background", "bg-background"],
  ["background-secondary", "bg-background-secondary"],
  ["background-tertiary", "bg-background-tertiary"],
  ["foreground", "bg-foreground"],
  ["foreground-secondary", "bg-foreground-secondary"],
  ["brand", "bg-brand"],
  ["brand-accent", "bg-brand-accent"],
] as const;

export default function Home() {
  return (
    <main className="mx-auto max-w-site px-gutter py-section">
      <p className="text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">
        01 / Design tokens
      </p>
      <h1 className="mt-6 font-display text-hero01">
        Your escape,
        <br />
        <em className="text-brand">within the city.</em>
      </h1>
      <p className="mt-8 max-w-prose text-body01 text-foreground-secondary">
        3 &amp; 4 BHK residences · SG Highway, Ahmedabad. This page previews the
        colour and type tokens and is replaced by the real home page in Task 5.
      </p>
      <ul className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
        {swatches.map(([name, cls]) => (
          <li key={name} className="text-caption01 text-foreground-secondary">
            <div className={`${cls} aspect-square border border-border`} />
            <span className="mt-2 block">{name}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
