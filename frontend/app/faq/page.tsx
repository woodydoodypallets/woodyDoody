import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { fetchContent, ContentItem } from "@/lib/api";

export const metadata: Metadata = {
  title: "FAQ | Woody Doody Pallets",
  description:
    "Answers to common questions about pallet sizes, delivery, recycling, and getting a quote from AK Pallet Blocks in the Dallas–Fort Worth area.",
};

export const dynamic = "force-dynamic";

function groupFaqs(faqs: ContentItem[]): { group: string; items: ContentItem[] }[] {
  const groups = new Map<string, ContentItem[]>();
  for (const f of faqs) {
    const groupName = (f.extra?.group as string) || "General";
    if (!groups.has(groupName)) groups.set(groupName, []);
    groups.get(groupName)!.push(f);
  }
  return Array.from(groups.entries()).map(([group, items]) => ({ group, items }));
}

export default async function FaqPage() {
  const faqs = await fetchContent("faq");
  const faqGroups = groupFaqs(faqs);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink floor-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/95 to-ink pointer-events-none" />
        <div className="absolute -top-24 -left-16 w-[460px] h-[460px] rounded-full bg-rust/10 blur-3xl animate-floaty pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 pt-20 pb-20 md:pt-24 md:pb-24">
          <Reveal>
            <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-display uppercase tracking-widest text-amber mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
              FAQ
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display uppercase text-5xl md:text-6xl font-bold tracking-tight text-white leading-[0.98] max-w-3xl">
              Questions, <span className="text-gradient">answered.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-mist text-lg mt-6 leading-relaxed max-w-xl">
              Can&apos;t find what you&apos;re looking for? Send us a quote request and a
              specialist will get back to you the same day.
            </p>
          </Reveal>
        </div>
      </section>

      {/* FAQ GROUPS */}
      {faqGroups.length > 0 && (
        <section className="max-w-4xl mx-auto px-5 md:px-8 py-20 flex flex-col gap-14">
          {faqGroups.map((group, gi) => (
            <div key={group.group}>
              <Reveal delay={gi * 60}>
                <span className="font-display uppercase text-xs tracking-widest text-rust">{group.group}</span>
              </Reveal>
              <div className="flex flex-col gap-3 mt-4">
                {group.items.map((f, i) => (
                  <Reveal key={f.id} delay={gi * 60 + i * 60}>
                    <details className="group stack-card-light p-5 open:pb-5">
                      <summary className="font-display uppercase text-sm cursor-pointer list-none flex items-center justify-between gap-4">
                        {f.title}
                        <span className="shrink-0 w-6 h-6 rounded-full bg-amber/15 text-amberdeep flex items-center justify-center text-base group-open:rotate-45 transition-transform duration-300">+</span>
                      </summary>
                      {f.body && <p className="text-sm text-ink/70 mt-3 leading-relaxed">{f.body}</p>}
                    </details>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-md bg-ink px-8 py-16 md:py-20 text-center">
            <div className="absolute inset-0 stripe-bar opacity-[0.06]" />
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-amber/20 blur-3xl animate-floaty" />
            <div className="relative">
              <h2 className="font-display uppercase text-3xl md:text-4xl font-bold text-white mb-3">
                Still have a <span className="text-gradient">question?</span>
              </h2>
              <p className="text-mist max-w-md mx-auto mb-8">
                Reach out and a specialist will walk you through the right pallet program.
              </p>
              <Link href="/quote" className="btn-primary font-display uppercase text-sm tracking-wide px-8 py-3.5 rounded-sm inline-block">
                Request a quote
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
