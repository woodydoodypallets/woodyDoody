import type { Metadata } from "next";
import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { fetchContent } from "@/lib/api";
import {
  TruckIcon,
  ArrowPathIcon,
  WrenchScrewdriverIcon,
  FireIcon,
  CalendarIcon,
  CubeIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Pallet Services | Woody Doody Pallets — DFW Delivery, Recycling & Custom Solutions",
  description:
    "Pallet services for the Dallas–Fort Worth area including local delivery, new and recycled pallets, custom solutions, heat-treated options, pallet pickup and recycling, and recurring supply.",
};

export const dynamic = "force-dynamic";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

const SERVICE_ICONS: Record<string, IconType> = {
  "Local Delivery": TruckIcon,
  "New & Recycled Pallets": ArrowPathIcon,
  "Custom Pallet Solutions": WrenchScrewdriverIcon,
  "Heat-Treated Options": FireIcon,
  "Pallet Pickup & Recycling": ArrowPathIcon,
  "Recurring Supply": CalendarIcon,
};

const steps = [
  { n: "01", icon: ChatBubbleLeftRightIcon, title: "Tell us what you need", desc: "Send us the details on quantity, condition, or delivery location, and requested date." },
  { n: "02", icon: ClipboardDocumentCheckIcon, title: "We review your request", desc: "We confirm product availability, delivery requirements, and any custom specifications." },
  { n: "03", icon: DocumentTextIcon, title: "Receive your quote", desc: "We provide clear pricing and an estimated delivery timeline." },
  { n: "04", icon: TruckIcon, title: "Delivery or pickup", desc: "Once approved, we coordinate delivery or pickup across the DFW area." },
];

export default async function ServicesPage() {
  const services = await fetchContent("service");

  return (
    <div>
      {/* HERO — full-bleed background photo, text overlaid on top */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/services-hero.jpg"
            alt="Stacked wooden pallets in a DFW warehouse"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 pt-20 pb-24 md:pt-24 md:pb-28">
          <Reveal>
            <span className="font-display uppercase text-xs tracking-widest text-amber">Services</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display uppercase text-5xl md:text-6xl font-bold tracking-tight text-white leading-[0.98] max-w-2xl mt-3">
              Pallet services <span className="text-gradient">built around</span> your business.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-mist text-lg mt-6 leading-relaxed max-w-xl">
              AK Pallet Blocks provides practical pallet solutions for businesses across
              the Dallas–Fort Worth area. Whether you need standard pallets, recurring
              deliveries, recycled options, or a custom size, we&apos;ll help you find the
              right solution for your operation.
            </p>
          </Reveal>
        </div>
      </section>

      {/* SERVICES GRID */}
      {services.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 md:px-8 py-24">
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => {
              const Icon = SERVICE_ICONS[s.title] || CubeIcon;
              return (
                <Reveal key={s.id} delay={i * 80}>
                  <div className="group relative stack-card-light hover:-translate-y-1.5 transition-transform duration-300">
                    {s.image_url && (
                      <div className="relative aspect-[2/1] bg-panel">
                        <Image src={s.image_url} alt={s.title} fill className="object-contain" sizes="(max-width: 768px) 100vw, 33vw" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className="w-10 h-10 rounded-full bg-amber/15 flex items-center justify-center text-amberdeep shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-display uppercase text-lg">{s.title}</h3>
                      </div>
                      {s.body && <p className="text-sm text-ink/65 leading-relaxed">{s.body}</p>}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      {/* HOW IT WORKS — flows directly into the CTA banner, no gap, matching reference */}
      <section className="bg-ink">
        <div className="max-w-7xl mx-auto px-5 md:px-8 pt-16 pb-14">
          <Reveal>
            <h2 className="font-display uppercase text-2xl md:text-3xl font-bold text-white mb-10">How it works</h2>
          </Reveal>
          <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="hidden lg:block absolute top-5 left-[12.5%] right-[12.5%] border-t-2 border-dotted border-amber/40" />
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 100}>
                <div className="relative">
                  <div className="relative z-10 w-10 h-10 rounded-full bg-amber-gradient text-ink font-display font-bold flex items-center justify-center text-sm mb-4">
                    {s.n}
                  </div>
                  <s.icon className="w-7 h-7 text-amber mb-3" />
                  <h3 className="font-display uppercase text-sm text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-mist leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal>
          <div className="relative overflow-hidden">
            <div className="absolute inset-0">
              <Image
                src="/images/services-cta-banner.jpg"
                alt="AK Pallet Blocks flatbed delivery truck loaded with pallets"
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/30" />
            </div>
            <div className="relative max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-20">
              <h2 className="font-display uppercase text-2xl md:text-3xl font-bold text-white mb-3 max-w-md">
                Need help choosing the <span className="text-gradient">right pallet?</span>
              </h2>
              <p className="text-mist max-w-md mb-7 leading-relaxed">
                Tell us about your load and delivery needs. We&apos;ll help you find a
                practical option for your business.
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
