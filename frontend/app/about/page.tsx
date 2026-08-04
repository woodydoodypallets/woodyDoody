import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import {
  HandRaisedIcon,
  CubeIcon,
  TruckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "About Us | Woody Doody Pallets — DFW Pallet Solutions",
  description:
    "Woody Doody Pallets provides dependable pallet solutions for businesses across the Dallas–Fort Worth area — new, recycled, custom, heat-treated, and export-ready options with responsive local service.",
};

const approach = [
  {
    icon: HandRaisedIcon,
    title: "Built on integrity",
    desc: "We do what we say and treat every customer with respect.",
  },
  {
    icon: CubeIcon,
    title: "Quality products",
    desc: "From new to recycled, our pallets are built to handle the load.",
  },
  {
    icon: TruckIcon,
    title: "Local & responsive",
    desc: "We're based in DFW and ready to deliver when you need us.",
  },
  {
    icon: UserGroupIcon,
    title: "Focused on you",
    desc: "Your business is our priority. We're here to support your success.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* HERO — full-bleed background photo, text overlaid on top (matches Services page) */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/about-forklift.jpg"
            alt="Forklift moving pallets in a DFW warehouse"
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
            <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-display uppercase tracking-widest text-amber mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
              About us
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display uppercase text-5xl md:text-6xl font-bold tracking-tight text-white leading-[0.98] max-w-2xl">
              A local company. <span className="text-gradient">Focused on what matters.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-mist text-lg mt-6 leading-relaxed max-w-lg">
              Woody Doody Pallets was built on hard work, honest service, and a commitment
              to doing the job right. We provide quality pallets and dependable support
              to businesses across the Dallas–Fort Worth area — helping you keep your
              supply chain strong and your operations moving.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <Link href="/quote" className="btn-primary inline-block font-display uppercase text-sm tracking-wide px-7 py-3.5 rounded-sm mt-8">
              Talk to our team
            </Link>
          </Reveal>
        </div>
      </section>

      {/* OUR APPROACH */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-24">
        <Reveal>
          <div className="text-center mb-14">
            <h2 className="font-display uppercase text-3xl md:text-4xl font-bold">
              Our <span className="text-gradient">approach</span>
            </h2>
            <p className="text-ink/60 mt-2">Simple. Reliable. Local.</p>
          </div>
        </Reveal>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {approach.map((a, i) => (
            <Reveal key={a.title} delay={i * 100}>
              <div className="text-center">
                <div className="icon-badge mx-auto mb-5">
                  <a.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display uppercase text-base mb-2">{a.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed">{a.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="bg-kraft2 py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <div className="group photo-card aspect-[4/3] shadow-stack">
              <Image
                src="/images/about-stack.jpg"
                alt="Stacked wooden pallets at Woody Doody Pallets"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="photo-card-overlay" />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <span className="font-display uppercase text-xs tracking-widest text-rust">Why Woody Doody Pallets</span>
            <h2 className="font-display uppercase text-3xl md:text-4xl font-bold mt-2 mb-5">
              Built on relationships, not just pallets
            </h2>
            <p className="text-ink/70 leading-relaxed mb-4">
              We&apos;re a new business with an old-fashioned approach: show up, do good
              work, and treat every customer like they matter — because they do. Whether
              you need standard pallets, recurring deliveries, recycled options, or a
              custom size, we&apos;ll help you find the right solution for your operation.
            </p>
            <p className="text-ink/70 leading-relaxed">
              As a Dallas–Fort Worth area company, we know the local market and the
              businesses that keep it moving. Let us go to work for you.
            </p>
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
                Let&apos;s put our <span className="text-gradient">team</span> to work for you
              </h2>
              <p className="text-mist max-w-md mx-auto mb-8">
                Tell us what you&apos;re shipping and we&apos;ll get a quote back to you fast.
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
