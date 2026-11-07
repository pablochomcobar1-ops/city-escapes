import Link from "next/link";
import { CTA, FACTS, FOOTER_CREDIT, NAV_LINKS } from "@/lib/site";
import { Wordmark } from "./Wordmark";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border-subtle">
      <div className="mx-auto max-w-site px-gutter pb-10 pt-section">
        <div className="grid gap-16 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Wordmark />
            <p className="mt-8 max-w-sm font-display text-heading02 text-foreground">
              Your escape, <em className="text-brand">within the city.</em>
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">Explore</p>
            <ul className="mt-5 space-y-3 text-body02">
              {[...NAV_LINKS, CTA].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-foreground-secondary transition-colors hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">Visit</p>
            <p className="mt-5 text-body02 text-foreground-secondary">
              {FACTS.homes}
              <br />
              {FACTS.location}
              <br />
              Sample flat open daily, 10 am – 7 pm
            </p>
          </div>
        </div>

        <div className="mt-section flex flex-col gap-4 border-t border-border-subtle pt-6 text-caption01 text-foreground-subtle md:flex-row md:items-center md:justify-between">
          <p>{FOOTER_CREDIT}</p>
          <div className="flex items-center gap-6">
            <span>© {year}</span>
            <a href="#top" className="transition-colors hover:text-foreground">
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
