"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type NavItem = { title: string; link_url?: string | null };

export default function MobileNav({ navItems }: { navItems: NavItem[] }) {
  const [open, setOpen] = useState(false);

  // Prevent background scroll while the menu is open, and always close
  // the menu if the viewport grows into the desktop breakpoint.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="relative w-9 h-9 flex items-center justify-center text-white"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <div className="w-6 h-5 relative flex flex-col justify-between">
          <span
            className={`block h-0.5 w-full bg-current rounded-full transition-transform duration-300 ${
              open ? "translate-y-[9px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-full bg-current rounded-full transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block h-0.5 w-full bg-current rounded-full transition-transform duration-300 ${
              open ? "-translate-y-[9px] -rotate-45" : ""
            }`}
          />
        </div>
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 top-[61px] bg-ink/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Menu panel */}
      <div
        className={`fixed top-[61px] left-0 right-0 z-40 bg-ink border-b border-white/10 overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          open ? "max-h-[80vh]" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col px-5 py-4">
          {navItems.map((item, i) => (
            <Link
              key={item.title}
              href={item.link_url || "/"}
              onClick={() => setOpen(false)}
              className={`font-display uppercase text-sm tracking-wider text-mist hover:text-white py-3.5 border-b border-white/5 last:border-b-0 transition-all duration-300 ${
                open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
              }`}
              style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
            >
              {item.title}
            </Link>
          ))}
          <Link
            href="/quote"
            onClick={() => setOpen(false)}
            className="btn-primary font-display uppercase text-sm tracking-wide px-5 py-3 rounded-sm text-center mt-4"
          >
            Request a quote
          </Link>
        </nav>
      </div>
    </div>
  );
}
