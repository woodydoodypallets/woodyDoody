"use client";

import { useState } from "react";
import { api } from "@/lib/api";

const palletTypes = ["New", "Used", "Remanufactured"];

// RFC-5322-lite email pattern — good enough for real-world validation without
// being so strict it rejects valid addresses.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Accepts common US formats: (123) 456-7890, 123-456-7890, 123.456.7890,
// 1234567890, +1 123 456 7890 — and common India formats: +91 98765 43210,
// 09876543210, 9876543210 (10 digits starting 6-9), +91-98765-43210.
const PHONE_PATTERN = /^(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$|^(\+?91[-.\s]?)?0?[6-9]\d{9}$|^(\+?91[-.\s]?)?[6-9]\d{4}[-.\s]?\d{5}$/;

const initialForm = {
  email: "",
  first_name: "",
  last_name: "",
  phone_number: "",
  pallet_size: "",
  quantity: "",
  address: "",
  address_line_2: "",
  city: "",
  state_province_region: "",
  postal_zip_code: "",
  country: "USA",
  decking_dimensions: "",
  pallet_type: "",
  method_of_delivery: "",
  message: "",
};

export default function QuotePage() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function set<K extends keyof typeof initialForm>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.email || !form.first_name || !form.last_name || !form.phone_number || !form.pallet_size || !form.quantity) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!EMAIL_PATTERN.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!PHONE_PATTERN.test(form.phone_number.trim())) {
      setError("Please enter a valid US or India phone number.");
      return;
    }
    const quantityNum = Number(form.quantity);
    if (!Number.isFinite(quantityNum) || quantityNum <= 0) {
      setError("Quantity must be a positive number.");
      return;
    }

    setLoading(true);
    try {
      const result = await api.submitQuote({
        email: form.email,
        first_name: form.first_name,
        last_name: form.last_name,
        phone_number: form.phone_number,
        pallet_size: form.pallet_size,
        quantity: quantityNum,
        address: form.address || undefined,
        address_line_2: form.address_line_2 || undefined,
        city: form.city || undefined,
        state_province_region: form.state_province_region || undefined,
        postal_zip_code: form.postal_zip_code || undefined,
        country: form.country || undefined,
        decking_dimensions: form.decking_dimensions || undefined,
        pallet_type: (form.pallet_type as any) || undefined,
        method_of_delivery: form.method_of_delivery || undefined,
        message: form.message || undefined,
      });
      setSubmitted(result.quote_request_id);
    } catch (err: any) {
      setError(err.message || "Could not submit quote request. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-5">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-gradient flex items-center justify-center mb-6 shadow-glow">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17L4 12" stroke="#0B1210" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="font-display uppercase text-3xl font-bold mb-3">Quote request sent</h1>
          <p className="text-ink/60 leading-relaxed mb-2">
            We&apos;ll review your request and get back to you the same day.
          </p>
          <p className="font-mono text-sm text-amberdeep bg-amber/10 inline-block px-3 py-1.5 rounded-sm">
            Reference: {submitted}
          </p>
          <p className="text-xs text-ink/50 mt-4">Keep this reference number for any follow-up questions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] grid lg:grid-cols-2">
      {/* Info panel */}
      <div className="relative hidden lg:flex flex-col justify-between bg-ink floor-grid px-12 py-14 overflow-hidden">
        <div className="absolute -top-24 -right-16 w-96 h-96 rounded-full bg-amber/10 blur-3xl animate-floaty pointer-events-none" />
        <div className="relative">
          <span className="font-display uppercase text-xs tracking-widest text-amber">Get a quote</span>
          <h2 className="font-display uppercase text-4xl font-bold text-white leading-[1.05] mt-3 mb-4">
            No account <span className="text-gradient">needed.</span>
          </h2>
          <p className="text-mist max-w-sm leading-relaxed">
            Just tell us what you need — most requests get a priced quote back the same
            business day.
          </p>
        </div>
        <div className="relative flex flex-col gap-4 max-w-sm">
          {[
            "Same-day quote turnaround",
            "New, used, or remanufactured pallets",
            "Every request gets a reference ID to track",
          ].map((line) => (
            <div key={line} className="flex items-center gap-3 text-sm text-white/80">
              <span className="w-5 h-5 rounded-full bg-amber/15 text-amber flex items-center justify-center text-xs shrink-0">✓</span>
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-5 py-14">
        <div className="w-full max-w-lg">
          <h1 className="font-display uppercase text-2xl font-bold mb-1">Request a quote</h1>
          <p className="text-sm text-ink/60 mb-7">Fields marked * are required.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <p className="text-rust text-sm bg-rust/10 border border-rust/20 rounded-sm px-3 py-2">{error}</p>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium block mb-1.5">First name *</label>
                <input required className="input-field" value={form.first_name} onChange={(e) => set("first_name", e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5">Last name *</label>
                <input required className="input-field" value={form.last_name} onChange={(e) => set("last_name", e.target.value)} />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium block mb-1.5">Email address *</label>
              <input
                required
                type="email"
                className="input-field"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                title="Enter a valid email address"
              />
            </div>

            <div>
              <label className="text-xs font-medium block mb-1.5">Phone number *</label>
              <input
                required
                type="tel"
                className="input-field"
                placeholder="e.g. (214) 555-0132 or +91 98765 43210"
                value={form.phone_number}
                onChange={(e) => set("phone_number", e.target.value)}
              />
              <p className="text-[11px] text-ink/40 mt-1">US or India phone numbers accepted.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium block mb-1.5">Pallet size *</label>
                <input required placeholder="e.g. 48x40" className="input-field" value={form.pallet_size} onChange={(e) => set("pallet_size", e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5">Quantity *</label>
                <input required type="number" min={1} className="input-field" value={form.quantity} onChange={(e) => set("quantity", e.target.value)} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium block mb-1.5">Decking dimensions</label>
                <input className="input-field" value={form.decking_dimensions} onChange={(e) => set("decking_dimensions", e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5">Pallet type</label>
                <select className="input-field" value={form.pallet_type} onChange={(e) => set("pallet_type", e.target.value)}>
                  <option value="">Select…</option>
                  {palletTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium block mb-1.5">Method of delivery</label>
              <input className="input-field" value={form.method_of_delivery} onChange={(e) => set("method_of_delivery", e.target.value)} />
            </div>

            <div className="border-t border-ink/10 pt-4 mt-1">
              <span className="text-xs font-display uppercase tracking-wide text-ink/40">Delivery address (optional)</span>
            </div>

            <div>
              <label className="text-xs font-medium block mb-1.5">Address</label>
              <input className="input-field" value={form.address} onChange={(e) => set("address", e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1.5">Address line 2</label>
              <input className="input-field" value={form.address_line_2} onChange={(e) => set("address_line_2", e.target.value)} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium block mb-1.5">City</label>
                <input className="input-field" value={form.city} onChange={(e) => set("city", e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5">State / Province / Region</label>
                <input className="input-field" value={form.state_province_region} onChange={(e) => set("state_province_region", e.target.value)} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium block mb-1.5">Postal / ZIP code</label>
                <input className="input-field" value={form.postal_zip_code} onChange={(e) => set("postal_zip_code", e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5">Country</label>
                <input className="input-field" value={form.country} onChange={(e) => set("country", e.target.value)} />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium block mb-1.5">Message</label>
              <textarea className="input-field min-h-[90px] resize-none" value={form.message} onChange={(e) => set("message", e.target.value)} />
            </div>

            <button disabled={loading} className="btn-primary font-display uppercase text-sm tracking-wide px-4 py-3 rounded-sm mt-2">
              {loading ? "Sending…" : "Send quote request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
