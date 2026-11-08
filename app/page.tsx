import { Hero } from "@/components/home/Hero";
import { Towers } from "@/components/home/Towers";

export default function Home() {
  return (
    <>
      <Hero />
      <Towers />
      {/* Sections arrive in Tasks 7–8. Spacer keeps scrolling testable meanwhile. */}
      <section id="residences" aria-label="Coming next" className="mx-auto max-w-site px-gutter py-section">
        <p className="text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">03 / Coming in Task 7</p>
        <div className="h-[60vh]" aria-hidden="true" />
      </section>
    </>
  );
}
