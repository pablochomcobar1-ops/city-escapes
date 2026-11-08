import { Hero } from "@/components/home/Hero";
import { Towers } from "@/components/home/Towers";
import { DawnToDusk } from "@/components/home/DawnToDusk";

export default function Home() {
  return (
    <>
      <Hero />
      <Towers />
      <DawnToDusk />
      {/* Sections arrive in Task 8. Spacer keeps scrolling testable meanwhile. */}
      <section id="residences" aria-label="Coming next" className="mx-auto max-w-site px-gutter py-section">
        <p className="text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">04 / Coming in Task 8</p>
        <div className="h-[60vh]" aria-hidden="true" />
      </section>
    </>
  );
}
