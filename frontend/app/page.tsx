import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import { fetchContent, fetchSettings, fetchPublicStats } from "@/lib/api";
import {
  CubeIcon,
  ArrowPathIcon,
  PencilIcon,
  GlobeAltIcon,
  FireIcon,
  MapPinIcon,
  TableCellsIcon,
  ClockIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

const PRODUCT_ICONS = [CubeIcon, ArrowPathIcon, PencilIcon, GlobeAltIcon, FireIcon];

const FEATURES = [
  { icon: MapPinIcon, title: "DFW Focused", desc: "Local service and support" },
  { icon: TableCellsIcon, title: "Pallets for Every Need", desc: "Standard, recycled, and custom options" },
  { icon: ClockIcon, title: "Dependable Response", desc: "Quick quotes and reliable communication" },
];

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, services, industries, testimonials, faqs, gallery, settings, stats] = await Promise.all([
    fetchContent("product"),
    fetchContent("service"),
    fetchContent("industry"),
    fetchContent("testimonial"),
    fetchContent("faq"),
    fetchContent("gallery"),
    fetchSettings(),
    fetchPublicStats(),
  ]);

  const heroLine1 = settings.hero_headline_line1 || "Built to carry.";
  const heroLine2 = settings.hero_headline_line2 || "Ready to earn your trust.";
  const heroSubtext = settings.hero_subtext ||
    "New, recycled, custom, export-ready, and heat-treated pallets, reliably delivered across Dallas–Fort Worth and surrounding areas.";
  const quoteCount = stats.quote_count;

  return (
    <div>
      {/* HERO — full-bleed background photo, text overlaid on top (matches Services page) */}
      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-pallets.jpg"
            alt="Stacked wooden pallets, Woody Doody Pallets"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 md:px-8 pt-16 pb-10 md:pt-20 md:pb-12">
          <Reveal>
            <h1 className="font-display uppercase text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[0.95] max-w-2xl">
              <span className="text-gradient">{heroLine1}</span><br />
              {heroLine2}
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="max-w-xl text-mist text-lg mt-6 leading-relaxed">{heroSubtext}</p>
          </Reveal>
          <Reveal delay={240}>
            <div className="flex gap-4 flex-wrap mt-9">
              <Link href="/quote" className="btn-primary font-display uppercase text-sm tracking-wide px-7 py-3.5 rounded-sm">
                Request a quote
              </Link>
              <a href="#products" className="glass text-white font-display uppercase text-sm tracking-wide px-7 py-3.5 rounded-sm hover:border-amber/40 transition-colors">
                See products
              </a>
            </div>
          </Reveal>

          {/*<Reveal delay={340}>
            {quoteCount > 0 ? (
              <div className="mt-10 max-w-md">
                <div className="inline-block stack-card p-6">
                  <div className="font-display text-4xl md:text-5xl font-bold text-amber">
                    <Counter to={quoteCount} suffix="+" />
                  </div>
                  <div className="text-xs uppercase tracking-widest text-mist mt-1">
                    Quote requests received to date
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-10 max-w-md">
                <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-xs font-display uppercase tracking-widest text-amber">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
                  Newly launched — be our first customer
                </span>
              </div>
            )}
          </Reveal> */}
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="bg-ink border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 grid gap-4 sm:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <div className="flex items-center gap-4 border border-amber/25 rounded-sm px-5 py-5 h-full">
                <div className="w-11 h-11 rounded-full border border-amber/40 flex items-center justify-center text-amber shrink-0">
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display uppercase text-sm text-white leading-snug">{f.title}</h3>
                  <p className="text-xs text-mist mt-0.5">{f.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      {products.length > 0 && (
        <section id="products" className="max-w-7xl mx-auto px-5 md:px-8 pt-24 pb-8">
          <Reveal>
            <span className="font-display uppercase text-xs tracking-widest text-rust">Products</span>
            <h2 className="font-display uppercase text-3xl md:text-4xl font-bold mt-2 mb-3">PALLET SOLUTIONS FOR EVERY LOAD</h2>
            <p className="text-ink/60 max-w-xl mb-12">New, recycled, custom, and heat-treated pallet options for businesses across the DFW area.</p>
          </Reveal>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {products.map((p, i) => {
              const Icon = PRODUCT_ICONS[i % PRODUCT_ICONS.length];
              return (
                <Reveal key={p.id} delay={i * 80}>
                  <div className="group stack-card h-full text-white transition-transform duration-300 hover:-translate-y-1 overflow-hidden">
                    {p.image_url && (
                      <div className="photo-card aspect-[4/3]">
                        <Image src={p.image_url} alt={p.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 20vw" />
                        <div className="photo-card-overlay" />
                      </div>
                    )}
                    <div className="p-5 pt-4">
                      <div className="icon-badge mb-3 -mt-9 relative z-10 border-4 border-panel">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-display uppercase text-base mb-1.5">{p.title}</h3>
                      {p.subtitle && <span className="font-mono text-[11px] text-amber">{p.subtitle}</span>}
                      {p.body && <p className="text-sm text-mist mt-3 leading-relaxed">{p.body}</p>}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      {/* PRODUCTS CTA STRIP */}
      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 md:px-8 pb-24">
          <Reveal>
            <div className="relative overflow-hidden rounded-md">
              <div className="absolute inset-0">
                <Image
                  src="/images/services-hero.jpg"
                  alt="Stacked pallets in warehouse"
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-ink/85" />
              </div>
              <div className="relative flex flex-col sm:flex-row items-center justify-between gap-5 px-6 sm:px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-amber/50 flex items-center justify-center text-amber shrink-0">
                    <TruckIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display uppercase text-base sm:text-lg text-white">Local Service. Dependable Solutions.</h3>
                    <p className="text-sm text-mist mt-0.5">Responsive support and on-time delivery across the DFW area.</p>
                  </div>
                </div>
                <Link href="/quote" className="btn-primary font-display uppercase text-sm tracking-wide px-6 py-3 rounded-sm whitespace-nowrap inline-flex items-center gap-2">
                  Get a quote today
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* SERVICES */}
      {services.length > 0 && (
        <section id="services" className="bg-kraft2 py-24">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <Reveal>
              <span className="font-display uppercase text-xs tracking-widest text-rust">Services</span>
              <h2 className="font-display uppercase text-3xl md:text-4xl font-bold mt-2 mb-3">More than a pallet supplier</h2>
              <p className="text-ink/60 max-w-xl mb-12">We handle the logistics around the pallet so your team doesn&apos;t have to.</p>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {services.slice(0, 5).map((s, i) => (
                <Reveal key={s.id} delay={i * 80}>
                  <div className="stack-card-light p-5 pt-6 h-full transition-transform duration-300 hover:-translate-y-1">
                    <div className="w-9 h-1.5 bg-amber-gradient rounded-full mb-4" />
                    <h3 className="font-display uppercase text-base mb-2">{s.title}</h3>
                    {s.body && <p className="text-sm text-ink/70 leading-relaxed">{s.body}</p>}
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={services.length * 80}>
              <Link href="/services" className="inline-flex items-center gap-1.5 mt-10 text-sm font-display uppercase tracking-wide text-amberdeep link-underline">
                See all services →
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* INDUSTRIES */}
      {industries.length > 0 && (
        <section id="industries" className="max-w-7xl mx-auto px-5 md:px-8 py-24">
          <Reveal>
            <span className="font-display uppercase text-xs tracking-widest text-rust">Industries</span>
            <h2 className="font-display uppercase text-3xl md:text-4xl font-bold mt-2 mb-10">Who we ship for</h2>
          </Reveal>
          <div className="flex flex-wrap gap-3">
            {industries.map((i, idx) => (
              <Reveal key={i.id} delay={idx * 50}>
                <span className="inline-block border border-ink/15 rounded-full px-5 py-2.5 text-sm font-medium hover:border-amber hover:bg-amber/10 hover:text-amberdeep transition-colors cursor-default">
                  {i.title}
                </span>
              </Reveal>
            ))}
          </div>
          <Reveal delay={industries.length * 50}>
            <Link href="/industries" className="inline-flex items-center gap-1.5 mt-8 text-sm font-display uppercase tracking-wide text-amberdeep link-underline">
              Explore industries in depth →
            </Link>
          </Reveal>
        </section>
      )}

      {/* FACILITY GALLERY */}
      {gallery.length > 0 && (
        <section className="bg-kraft2 py-24">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <Reveal>
              <span className="font-display uppercase text-xs tracking-widest text-rust">Our facility</span>
              <h2 className="font-display uppercase text-3xl md:text-4xl font-bold mt-2 mb-3">Inside the yard</h2>
              <p className="text-ink/60 max-w-xl mb-10">
                A working look at where your pallets come from — stocked, sorted, and moving
                through our Dallas–Fort Worth yard every day.
              </p>
            </Reveal>
            <div className="grid gap-6 md:grid-cols-5">
              {gallery.slice(0, 2).map((g, idx) => (
                <Reveal key={g.id} delay={idx * 100} className={idx === 0 ? "md:col-span-3" : "md:col-span-2"}>
                  <div className="group photo-card aspect-[16/10]">
                    {g.image_url && (
                      <Image
                        src={g.image_url}
                        alt={g.title}
                        fill
                        className="object-cover"
                        sizes={idx === 0 ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 100vw, 40vw"}
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
            <Reveal delay={200}>
              <Link href="/gallery" className="inline-flex items-center gap-1.5 mt-8 text-sm font-display uppercase tracking-wide text-amberdeep link-underline">
                View full gallery →
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="bg-ink floor-grid py-24">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <Reveal>
              <span className="font-display uppercase text-xs tracking-widest text-amber">Testimonials</span>
              <h2 className="font-display uppercase text-3xl md:text-4xl font-bold mt-2 mb-12 text-white">What our customers say</h2>
            </Reveal>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((t, i) => {
                const rating = Number(t.extra?.rating) || 5;
                return (
                  <Reveal key={t.id} delay={i * 100}>
                    <div className="glass rounded-sm p-6 h-full flex flex-col">
                      <div className="star-rating text-sm mb-3" aria-label={`${rating} out of 5 stars`}>
                        {"★".repeat(rating)}{"☆".repeat(Math.max(0, 5 - rating))}
                      </div>
                      <svg width="28" height="22" viewBox="0 0 28 22" fill="none" className="text-amber mb-4">
                        <path d="M0 22V13.2C0 8.53 1.27 5.13 3.8 3C6.33 0.87 9.13 -0.13 12.2 0.02V4.4C10.33 4.4 8.8 4.93 7.6 6C6.4 7.07 5.8 8.53 5.8 10.4H12.2V22H0ZM15.8 22V13.2C15.8 8.53 17.07 5.13 19.6 3C22.13 0.87 24.93 -0.13 28 0.02V4.4C26.13 4.4 24.6 4.93 23.4 6C22.2 7.07 21.6 8.53 21.6 10.4H28V22H15.8Z" fill="currentColor"/>
                      </svg>
                      {t.body && <p className="text-mist text-sm leading-relaxed flex-1">{t.body}</p>}
                      <div className="mt-5 pt-5 border-t border-white/10">
                        <div className="text-white text-sm font-semibold">{t.title}</div>
                        {t.subtitle && <div className="text-xs text-mist">{t.subtitle}</div>}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section id="faq" className="max-w-4xl mx-auto px-5 md:px-8 py-24">
          <Reveal>
            <span className="font-display uppercase text-xs tracking-widest text-rust">FAQ</span>
            <h2 className="font-display uppercase text-3xl md:text-4xl font-bold mt-2 mb-12">Common questions</h2>
          </Reveal>
          <div className="flex flex-col gap-3">
            {faqs.slice(0, 6).map((f, i) => (
              <Reveal key={f.id} delay={i * 70}>
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
          <Reveal delay={faqs.length * 70}>
            <Link href="/faq" className="inline-flex items-center gap-1.5 mt-8 text-sm font-display uppercase tracking-wide text-amberdeep link-underline">
              See all FAQs →
            </Link>
          </Reveal>
        </section>
      )}

      {/* CTA BANNER */}
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
                Tell us your volume and we&apos;ll get a quote back the same day.
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
