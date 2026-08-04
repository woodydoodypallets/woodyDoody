import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import DeliveryTruckArt from "@/components/illustrations/DeliveryTruckArt";
import { fetchContent } from "@/lib/api";
import { CubeIcon } from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Industries We Serve | Woody Doody Pallets",
  description:
    "Pallets for automotive, retail, manufacturing, and more across the Dallas–Fort Worth area — new, recycled, and custom options built to spec.",
};

export const dynamic = "force-dynamic";

export default async function IndustriesPage() {
  const industries = await fetchContent("industry");

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink floor-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/95 to-ink pointer-events-none" />
        <div className="absolute -top-24 -right-16 w-[460px] h-[460px] rounded-full bg-amber/10 blur-3xl animate-floaty pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 pt-20 pb-24 md:pt-24 md:pb-28 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-display uppercase tracking-widest text-amber mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
              Industries
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display uppercase text-5xl md:text-6xl font-bold tracking-tight text-white leading-[0.98]">
              Who we <span className="text-gradient">ship for.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-mist text-lg mt-6 leading-relaxed max-w-xl">
              Every industry loads differently. We work with businesses across the
              Dallas–Fort Worth area to match the right pallet to the right load — here&apos;s
              where we spend most of our time.
            </p>
          </Reveal>
        </div>
        <Reveal delay={200} className="hidden lg:block">
          <div className="group">
            <DeliveryTruckArt className="w-full h-auto hover-zoom" />
          </div>
        </Reveal>
        </div>
      </section>

      {/* INDUSTRIES GRID */}
      {industries.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 md:px-8 py-24">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((ind, i) => (
              <Reveal key={ind.id} delay={i * 70}>
                <div className="group relative aspect-[4/5] rounded-md overflow-hidden photo-panel">
                  <div className="hover-zoom absolute inset-0 flex items-center justify-center">
                    <CubeIcon className="w-16 h-16 text-amber/30" />
                  </div>
                  <div className="card-overlay" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <CubeIcon className="w-7 h-7 text-amber mb-2" />
                    <h3 className="font-display uppercase text-white text-base mb-1.5">{ind.title}</h3>
                    {ind.body && (
                      <p className="text-xs text-mist leading-relaxed opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-20 transition-all duration-300 overflow-hidden">
                        {ind.body}
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* WHY US STRIP */}
      <section className="bg-kraft2 py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-3 gap-8">
          <Reveal>
            <h3 className="font-display uppercase text-lg mb-2">Pallets for every load</h3>
            <p className="text-sm text-ink/65 leading-relaxed">New, recycled, custom, heat-treated, and export-ready options — built for your load, not a generic standard.</p>
          </Reveal>
          <Reveal delay={100}>
            <h3 className="font-display uppercase text-lg mb-2">Responsive local service</h3>
            <p className="text-sm text-ink/65 leading-relaxed">Quick quotes and reliable communication, with delivery across the Dallas–Fort Worth area.</p>
          </Reveal>
          <Reveal delay={200}>
            <h3 className="font-display uppercase text-lg mb-2">Flexible & dependable</h3>
            <p className="text-sm text-ink/65 leading-relaxed">From a single delivery to recurring supply, we scale to fit your operation.</p>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-md bg-ink px-8 py-16 md:py-20 text-center">
            <div className="absolute inset-0 stripe-bar opacity-[0.06]" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-amber/20 blur-3xl animate-floaty" />
            <div className="relative">
              <h2 className="font-display uppercase text-3xl md:text-4xl font-bold text-white mb-3">
                Don&apos;t see your <span className="text-gradient">industry?</span>
              </h2>
              <p className="text-mist max-w-md mx-auto mb-8">
                We&apos;ve built pallet programs for operations we haven&apos;t listed yet. Tell us about yours.
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
