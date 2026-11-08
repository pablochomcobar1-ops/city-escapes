import { Hero } from "@/components/home/Hero";

export default function Home() {
  return (
    <>
      <Hero />
      {/* Sections arrive in Tasks 6–8. Spacer keeps scrolling testable meanwhile. */}
      <section id="residences" aria-label="Coming next" className="mx-auto max-w-site px-gutter py-section">
        <p className="text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">02 / Coming in Task 6</p>
        <div className="h-[110vh]" aria-hidden="true" />
      </section>
    </>
  );
}
