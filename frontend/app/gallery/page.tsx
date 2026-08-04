import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { fetchContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Gallery | Woody Doody Pallets",
  description: "A look at our pallets, yard, and warehouse across the Dallas–Fort Worth area.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const gallery = await fetchContent("gallery");

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink floor-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/95 to-ink pointer-events-none" />
        <div className="absolute -top-24 -right-16 w-[460px] h-[460px] rounded-full bg-amber/10 blur-3xl animate-floaty pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 pt-20 pb-16 md:pt-24 md:pb-20">
          <Reveal>
            <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-display uppercase tracking-widest text-amber mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
              Gallery
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display uppercase text-5xl md:text-6xl font-bold tracking-tight text-white leading-[0.98]">
              A look <span className="text-gradient">inside.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-mist text-lg mt-6 leading-relaxed max-w-xl">
              Our pallets, our yard, and the work that goes into every delivery across
              the Dallas–Fort Worth area.
            </p>
          </Reveal>
        </div>
      </section>

      {/* GALLERY GRID */}
      {gallery.length > 0 ? (
        <section className="max-w-7xl mx-auto px-5 md:px-8 py-20">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((g, i) => (
              <Reveal key={g.id} delay={i * 60}>
                <div className="group photo-card aspect-[4/3] shadow-stack">
                  {g.image_url && (
                    <Image
                      src={g.image_url}
                      alt={g.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  )}
                  <div className="photo-card-overlay" />
                  <div className="absolute bottom-0 left-0 p-5">
                    <span className="text-white font-display uppercase text-sm tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {g.title}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      ) : (
        <section className="max-w-7xl mx-auto px-5 md:px-8 py-20 text-center">
          <p className="text-ink/50">More photos coming soon.</p>
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
                Like what you <span className="text-gradient">see?</span>
              </h2>
              <p className="text-mist max-w-md mx-auto mb-8">
                Tell us what you need and we&apos;ll get a quote back to you fast.
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
