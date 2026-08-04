"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const CONTENT_LINKS: { section: string; label: string }[] = [
  { section: "product", label: "Products" },
  { section: "service", label: "Services" },
  { section: "industry", label: "Industries" },
  { section: "faq", label: "FAQ" },
  { section: "testimonial", label: "Testimonials" },
  { section: "gallery", label: "Gallery" },
  { section: "office_location", label: "Contact locations" },
  { section: "nav_item", label: "Nav menu" },
  { section: "footer_link", label: "Footer links" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  function handleLogout() {
    api.logout();
    router.push("/admin/login");
  }

  return (
    <div className="bg-kraft2 min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 flex flex-col md:flex-row gap-8">
        <aside className="md:w-56 shrink-0">
          <nav className="flex md:flex-col gap-1.5 stack-card-light p-3 md:sticky md:top-20 overflow-x-auto">
            <Link href="/admin" className="font-display uppercase text-xs tracking-wide px-3 py-2.5 rounded-sm hover:bg-amber/10 hover:text-amberdeep transition-colors whitespace-nowrap">
              Overview
            </Link>
            <Link href="/admin/quotes" className="font-display uppercase text-xs tracking-wide px-3 py-2.5 rounded-sm hover:bg-amber/10 hover:text-amberdeep transition-colors whitespace-nowrap">
              Quote Requests
            </Link>
            <div className="h-px bg-ink/10 my-1.5 md:mx-1" />
            <span className="px-3 pt-1 pb-0.5 text-[10px] font-display uppercase tracking-widest text-ink/35 hidden md:block">Website content</span>
            {CONTENT_LINKS.map((c) => (
              <Link
                key={c.section}
                href={`/admin/content/${c.section}`}
                className="font-display uppercase text-xs tracking-wide px-3 py-2.5 rounded-sm hover:bg-amber/10 hover:text-amberdeep transition-colors whitespace-nowrap"
              >
                {c.label}
              </Link>
            ))}
            <Link href="/admin/settings" className="font-display uppercase text-xs tracking-wide px-3 py-2.5 rounded-sm hover:bg-amber/10 hover:text-amberdeep transition-colors whitespace-nowrap">
              Homepage & contact
            </Link>
            <div className="h-px bg-ink/10 my-1.5 md:mx-1" />
            <button onClick={handleLogout} className="text-left font-display uppercase text-xs tracking-wide px-3 py-2.5 rounded-sm hover:bg-rust/10 hover:text-rust transition-colors whitespace-nowrap">
              Log out
            </button>
          </nav>
        </aside>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
