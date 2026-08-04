"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, AdminStats } from "@/lib/api";

export default function AdminOverview() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const s = await api.admin.stats();
        setStats(s);
      } catch (err: any) {
        router.push("/admin/login");
      }
    })();
  }, [router]);

  if (error) return <p className="text-rust">{error}</p>;
  if (!stats) {
    return <span className="font-display uppercase text-sm tracking-widest text-ink/40">Loading…</span>;
  }

  const cards = [
    { label: "Total requests", value: stats.total_quotes, href: "/admin/quotes", accent: "text-ink" },
    { label: "New", value: stats.new_quotes, href: "/admin/quotes?status=New", accent: "text-amberdeep" },
    { label: "In progress", value: stats.in_progress_quotes, href: "/admin/quotes?status=In+Progress", accent: "text-blue-700" },
    { label: "Completed", value: stats.completed_quotes, href: "/admin/quotes?status=Completed", accent: "text-emerald-700" },
  ];

  return (
    <div>
      <span className="font-display uppercase text-xs tracking-widest text-rust">Admin</span>
      <h1 className="font-display uppercase text-3xl font-bold mt-1 mb-8">Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="stack-card-light p-5 hover:-translate-y-1 transition-transform duration-300 block"
          >
            <div className={`font-mono text-3xl font-semibold ${c.accent}`}>{c.value}</div>
            <div className="text-xs font-display uppercase tracking-wide text-ink/50 mt-1.5">{c.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
