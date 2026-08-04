import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { fetchContent } from "@/lib/api";
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Contact Us | Woody Doody Pallets",
  description: "Get in touch with Woody Doody Pallets — office locations, phone, and email across the Dallas–Fort Worth area.",
};

export const dynamic = "force-dynamic";

function mapsEmbedSrc(query: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

function mapsLinkHref(query: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}`;
}

export default async function ContactPage() {
  const locations = await fetchContent("office_location");

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
              Contact
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display uppercase text-5xl md:text-6xl font-bold tracking-tight text-white leading-[0.98]">
              Get in <span className="text-gradient">touch.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-mist text-lg mt-6 leading-relaxed max-w-xl">
              Reach out to any of our locations below, or send us a quote request
              and we&apos;ll get back to you fast.
            </p>
          </Reveal>
        </div>
      </section>

      {/* LOCATIONS */}
      {locations.length > 0 ? (
        <section className="max-w-7xl mx-auto px-5 md:px-8 py-20">
          <div className="grid gap-8 lg:grid-cols-2">
            {locations.map((loc, i) => {
              const officeType = (loc.extra?.type as string) || "";
              const phone = loc.extra?.phone as string | undefined;
              const email = loc.extra?.email as string | undefined;
              const mapQuery = loc.link_url || loc.body || loc.title;
              return (
                <Reveal key={loc.id} delay={i * 100}>
                  <div className="stack-card-light overflow-hidden">
                    <div className="p-6">
                      {officeType && (
                        <span className="inline-block text-[11px] font-display uppercase tracking-widest text-amberdeep bg-amber/10 px-2.5 py-1 rounded-full mb-3">
                          {officeType}
                        </span>
                      )}
                      <h3 className="font-display uppercase text-xl mb-3">{loc.title}</h3>
                      <div className="flex flex-col gap-2 text-sm text-ink/70">
                        {loc.body && (
                          <div className="flex items-start gap-2.5">
                            <MapPinIcon className="w-4 h-4 mt-0.5 text-amberdeep shrink-0" />
                            <span>{loc.body}</span>
                          </div>
                        )}
                        {phone && (
                          <a href={`tel:${phone}`} className="flex items-center gap-2.5 hover:text-amberdeep transition-colors">
                            <PhoneIcon className="w-4 h-4 text-amberdeep shrink-0" />
                            <span>{phone}</span>
                          </a>
                        )}
                        {email && (
                          <a href={`mailto:${email}`} className="flex items-center gap-2.5 hover:text-amberdeep transition-colors">
                            <EnvelopeIcon className="w-4 h-4 text-amberdeep shrink-0" />
                            <span>{email}</span>
                          </a>
                        )}
                      </div>
                    </div>
                    <a
                      href={mapsLinkHref(mapQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/map relative block aspect-[16/9] border-t border-ink/10"
                      aria-label={`Open ${loc.title} in Google Maps`}
                    >
                      <iframe
                        src={mapsEmbedSrc(mapQuery)}
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        style={{ border: 0 }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Map for ${loc.title}`}
                      />
                      <div className="absolute inset-0 bg-ink/0 group-hover/map:bg-ink/10 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover/map:opacity-100 transition-opacity bg-ink text-white text-xs font-display uppercase tracking-wide px-4 py-2 rounded-sm shadow-lg">
                          Open in Google Maps →
                        </span>
                      </div>
                    </a>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="max-w-7xl mx-auto px-5 md:px-8 py-20 text-center">
          <p className="text-ink/50">Location details coming soon.</p>
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
                Ready to talk <span className="text-gradient">pallets?</span>
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
