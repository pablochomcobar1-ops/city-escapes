import { Reveal } from "@/components/motion/Reveal";
import { MILESTONES } from "@/lib/home";

const doneCount = MILESTONES.filter((m) => m.state === "done").length;
// Dots sit at the start of each column (0, 20, 40…%); fill runs just past the current one.
const fill = (doneCount / MILESTONES.length) * 100 + 4;

export function Progress({ label = "07 / Progress" }: { label?: string }) {
  return (
    <section aria-labelledby="progress-title" className="mx-auto max-w-site px-gutter py-section">
      <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-end">
        <div>
          <p className="text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">{label}</p>
          <h2 id="progress-title" className="mt-5 font-display text-heading01 text-foreground">
            Built in <em className="text-brand">the open.</em>
          </h2>
        </div>
        <p className="max-w-lg text-body01 text-foreground-secondary md:justify-self-end">
          Delays are the first worry of anyone buying an unfinished home, so here is where we are, updated
          every month. Possession is planned for December 2028.
        </p>
      </div>

      <Reveal className="relative mt-16">
        {/* Track: vertical on phones, horizontal on desktop */}
        <div aria-hidden="true" className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-border md:hidden">
          <span data-fill className="absolute inset-x-0 top-0 bg-brand" style={{ height: `${fill}%` }} />
        </div>
        <div aria-hidden="true" className="absolute inset-x-0 top-[7px] hidden h-px bg-border md:block">
          <span data-fill className="absolute inset-y-0 left-0 bg-brand" style={{ width: `${fill}%` }} />
        </div>
        <ol className="relative grid gap-10 md:grid-cols-5 md:gap-6">
          {MILESTONES.map((m) => (
            <li key={m.name} className="flex gap-5 md:block" aria-current={m.state === "now" ? "step" : undefined}>
              <span
                aria-hidden="true"
                className={[
                  "relative mt-1 block size-[15px] shrink-0 rounded-full border md:mt-0",
                  m.state === "next" ? "border-border bg-background" : "border-brand bg-brand",
                ].join(" ")}
              >
                {m.state === "now" && <span className="absolute inset-0 animate-ping rounded-full bg-brand opacity-50" />}
              </span>
              <div className="md:mt-6">
                <p className="font-display text-heading02 text-foreground">{m.name}</p>
                <p className="mt-1 text-caption01 text-foreground-secondary">
                  {m.state === "done" ? `Completed · ${m.when}` : m.when}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
      <p className="mt-12 text-caption01 text-foreground-subtle">
        RERA: concept project, not registered. In a real launch the registration number goes here.
      </p>
    </section>
  );
}
