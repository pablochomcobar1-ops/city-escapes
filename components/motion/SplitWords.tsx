/**
 * Splits text into words that rise out of a mask one after another.
 * Pure CSS (keyframe ce-word in globals.css): runs on first paint with no JS, and the
 * global reduced-motion rule makes it show the final state instantly.
 */
export function SplitWords({
  text,
  startIndex = 0,
  delay = 250,
  stagger = 80,
  className = "",
}: {
  text: string;
  startIndex?: number;
  delay?: number;
  stagger?: number;
  className?: string;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <span
            className="inline-block animate-[ce-word_1100ms_var(--ease-luxe)_both]"
            style={{ animationDelay: `${delay + (startIndex + i) * stagger}ms` }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </span>
  );
}
