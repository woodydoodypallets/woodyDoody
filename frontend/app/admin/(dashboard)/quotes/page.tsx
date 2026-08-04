"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api, Quote } from "@/lib/api";

const statusTabs = ["all", "New", "In Progress", "Completed"];

const statusBadge: Record<string, string> = {
  New: "border-amber text-amberdeep",
  "In Progress": "border-blue-600 text-blue-700",
  Completed: "border-emerald-600 text-emerald-700",
};

export default function AdminQuotes() {
  return (
    <Suspense fallback={<span className="font-display uppercase text-sm tracking-widest text-ink/40">Loading…</span>}>
      <AdminQuotesInner />
    </Suspense>
  );
}

function AdminQuotesInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeStatus = searchParams.get("status") || "all";
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [noteDrafts, setNoteDrafts] = useState<Record<number, string>>({});
  const [expanded, setExpanded] = useState<number | null>(null);

  async function load(status: string, searchTerm?: string) {
    setLoading(true);
    try {
      const data = await api.admin.quotes(status === "all" ? undefined : status, searchTerm || undefined);
      setQuotes(data);
    } catch (err: any) {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(activeStatus, search); }, [activeStatus]);

  async function handleStatusChange(id: number, status: string) {
    const updated = await api.admin.updateQuote(id, { status, admin_note: noteDrafts[id] });
    setQuotes((prev) => prev.map((q) => (q.id === id ? updated : q)));
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this quote request? This cannot be undone.")) return;
    await api.admin.deleteQuote(id);
    setQuotes((prev) => prev.filter((q) => q.id !== id));
  }

  return (
    <div>
      <span className="font-display uppercase text-xs tracking-widest text-rust">Admin</span>
      <h1 className="font-display uppercase text-3xl font-bold mt-1 mb-6">Quote requests</h1>

      <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
        <div className="flex gap-2 flex-wrap">
          {statusTabs.map((s) => (
            <button
              key={s}
              onClick={() => router.push(`/admin/quotes${s === "all" ? "" : `?status=${encodeURIComponent(s)}`}`)}
              className={`font-display uppercase text-xs tracking-wide px-4 py-2 rounded-sm border-2 transition-colors ${
                activeStatus === s ? "bg-amber-gradient border-transparent text-ink" : "border-ink/15 bg-white hover:border-amber"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); load(activeStatus, search); }} className="flex gap-2">
          <input
            placeholder="Search name, email, phone, or ID"
            className="input-field w-64 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn-primary font-display uppercase text-xs tracking-wide px-4 py-2 rounded-sm whitespace-nowrap">
            Search
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-3">
        {loading && <span className="font-display uppercase text-sm tracking-widest text-ink/40">Loading…</span>}
        {!loading && quotes.length === 0 && <p className="text-ink/50">No quote requests in this view.</p>}
        {quotes.map((q) => {
          const isOpen = expanded === q.id;
          return (
            <div key={q.id} className="stack-card-light p-5">
              <div className="flex justify-between flex-wrap gap-3 mb-3">
                <div>
                  <span className="font-mono text-xs text-amberdeep">{q.quote_request_id}</span>
                  <div className="mt-0.5">
                    <span className="font-display uppercase text-sm">{q.first_name} {q.last_name}</span>
                    <span className="text-xs text-ink/50 ml-2">{q.email}</span>
                    <span className="text-xs text-ink/50 ml-2">{q.phone_number}</span>
                  </div>
                </div>
                <span className="font-mono text-xs text-ink/50">{new Date(q.created_at).toLocaleString()}</span>
              </div>

              <div className="flex flex-wrap gap-4 text-sm mb-3">
                <span>Pallet size: <strong>{q.pallet_size}</strong></span>
                <span>Qty: <strong className="font-mono">{q.quantity}</strong></span>
                {q.pallet_type && <span>Type: <strong>{q.pallet_type}</strong></span>}
              </div>

              <button
                onClick={() => setExpanded(isOpen ? null : q.id)}
                className="text-xs font-display uppercase tracking-wide text-amberdeep link-underline mb-3"
              >
                {isOpen ? "Hide details" : "View full details"}
              </button>

              {isOpen && (
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-ink/70 mb-4 bg-ink/5 rounded-sm p-4">
                  <span>Address: {q.address || "—"}</span>
                  <span>Address line 2: {q.address_line_2 || "—"}</span>
                  <span>City: {q.city || "—"}</span>
                  <span>State/Province: {q.state_province_region || "—"}</span>
                  <span>Postal/ZIP: {q.postal_zip_code || "—"}</span>
                  <span>Country: {q.country || "—"}</span>
                  <span>Decking dimensions: {q.decking_dimensions || "—"}</span>
                  <span>Delivery method: {q.method_of_delivery || "—"}</span>
                  {q.message && <span className="sm:col-span-2">Message: {q.message}</span>}
                </div>
              )}

              <div className="flex items-center gap-2 flex-wrap">
                <input
                  placeholder="Internal note (optional)"
                  className="input-field text-xs flex-1 min-w-[180px] py-2"
                  defaultValue={q.admin_note || ""}
                  onChange={(e) => setNoteDrafts((prev) => ({ ...prev, [q.id]: e.target.value }))}
                />
                <select
                  defaultValue={q.status}
                  onChange={(e) => handleStatusChange(q.id, e.target.value)}
                  className="input-field text-xs py-2 w-auto"
                >
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <span className={`font-display uppercase text-xs tracking-wide px-2.5 py-1.5 rounded-sm border-2 ${statusBadge[q.status]}`}>
                  {q.status}
                </span>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="ml-auto text-xs font-display uppercase tracking-wide text-rust hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
