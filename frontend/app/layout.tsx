import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import { fetchContent, fetchSettings, ContentItem } from "@/lib/api";
import MobileNav from "@/components/MobileNav";

export const metadata: Metadata = {
  title: "Woody Doody Pallets — Built to carry. Ready to earn your trust.",
  description:
    "New, recycled, custom, export-ready, and heat-treated pallets, reliably delivered across Dallas–Fort Worth and surrounding areas.",
};

const FALLBACK_NAV = [
  { title: "Home", link_url: "/#home" },
  { title: "Products", link_url: "/#products" },
  { title: "Services", link_url: "/services" },
  { title: "About Us", link_url: "/about" },
  { title: "Gallery", link_url: "/gallery" },
  { title: "FAQ", link_url: "/faq" },
  { title: "Contact", link_url: "/contact" },
];

function groupByColumn(links: ContentItem[]): Record<string, ContentItem[]> {
  const groups: Record<string, ContentItem[]> = {};
  for (const link of links) {
    const column = (link.extra?.column as string) || "Company";
    if (!groups[column]) groups[column] = [];
    groups[column].push(link);
  }
  return groups;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [navItemsRaw, footerLinksRaw, settings] = await Promise.all([
    fetchContent("nav_item"),
    fetchContent("footer_link"),
    fetchSettings(),
  ]);

  const navItems = navItemsRaw.length > 0 ? navItemsRaw : FALLBACK_NAV;
  const footerColumns = groupByColumn(footerLinksRaw);
  const footerTagline = settings.footer_tagline ||
    "New, recycled, custom, and heat-treated pallet solutions for businesses across the Dallas–Fort Worth area.";

  return (
    <html lang="en">
      <body className="font-body antialiased">
        <header className="sticky top-0 z-50 bg-ink/90 backdrop-blur-md border-b border-white/5">
          <nav className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-5 md:px-8 py-3.5">
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image
                src="/images/logo.png"
                alt="Woody Doody Pallets"
                width={44}
                height={44}
                className="w-10 h-10 object-contain"
                priority
              />
              <span className="font-display uppercase tracking-wide text-[15px] text-white leading-none">
                Woody <span className="text-amber">Doody Pallets</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-7 text-[13px] font-display uppercase tracking-wider text-mist">
              {navItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.link_url || "/"}
                  className="link-underline hover:text-white transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/quote"
                className="hidden md:inline-block btn-primary font-display uppercase text-[13px] tracking-wide px-5 py-2.5 rounded-sm whitespace-nowrap"
              >
                Get a quote
              </Link>
              <MobileNav navItems={navItems} />
            </div>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="bg-ink text-white/70 mt-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <Image src="/images/logo.png" alt="Woody Doody Pallets" width={32} height={32} className="w-8 h-8 object-contain" />
                <span className="font-display uppercase tracking-wide text-sm text-white">Woody Doody Pallets</span>
              </div>
              <p className="text-sm max-w-sm leading-relaxed">{footerTagline}</p>
            </div>
            {Object.entries(footerColumns).length > 0 ? (
              Object.entries(footerColumns).map(([column, links]) => (
                <div key={column}>
                  <h4 className="font-display uppercase text-xs tracking-widest text-amber mb-3">{column}</h4>
                  <div className="flex flex-col gap-2 text-sm">
                    {links.map((link) => (
                      <Link key={link.id} href={link.link_url || "/"} className="hover:text-amber transition-colors">
                        {link.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <>
                <div>
                  <h4 className="font-display uppercase text-xs tracking-widest text-amber mb-3">Company</h4>
                  <div className="flex flex-col gap-2 text-sm">
                    <Link href="/#products" className="hover:text-amber transition-colors">Products</Link>
                    <Link href="/services" className="hover:text-amber transition-colors">Services</Link>
                    <Link href="/about" className="hover:text-amber transition-colors">About Us</Link>
                    <Link href="/gallery" className="hover:text-amber transition-colors">Gallery</Link>
                    <Link href="/faq" className="hover:text-amber transition-colors">FAQ</Link>
                    <Link href="/contact" className="hover:text-amber transition-colors">Contact</Link>
                  </div>
                </div>
                <div>
                  <h4 className="font-display uppercase text-xs tracking-widest text-amber mb-3">Get started</h4>
                  <div className="flex flex-col gap-2 text-sm">
                    <Link href="/quote" className="hover:text-amber transition-colors">Request a quote</Link>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="border-t border-white/5">
            <div className="max-w-7xl mx-auto px-5 md:px-8 py-5 flex justify-between flex-wrap gap-2 text-xs">
              <span>© {new Date().getFullYear()} Woody Doody Pallets. All rights reserved.</span>
              <div className="flex gap-5">
                <Link href="/privacy" className="hover:text-amber transition-colors">Privacy policy</Link>
                <Link href="/terms" className="hover:text-amber transition-colors">Terms</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
