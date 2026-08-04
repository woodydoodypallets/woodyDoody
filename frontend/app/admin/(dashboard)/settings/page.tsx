"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const SETTING_LABELS: Record<string, string> = {
  hero_headline_line1: "Hero headline — line 1",
  hero_headline_line2: "Hero headline — line 2",
  hero_subtext: "Hero subtext",
  footer_tagline: "Footer tagline",
};

export default function AdminSettingsPage() {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const settings = await api.admin.listSettings();
        const map: Record<string, string> = {};
        for (const s of settings) map[s.key] = s.value || "";
        setValues(map);
      } catch {
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await api.admin.updateSettings(values);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <span className="font-display uppercase text-sm tracking-widest text-ink/40">Loading…</span>;

  const keys = Object.keys(SETTING_LABELS);

  return (
    <div>
      <span className="font-display uppercase text-xs tracking-widest text-rust">Content</span>
      <h1 className="font-display uppercase text-3xl font-bold mt-1 mb-3">Homepage & contact settings</h1>
      <p className="text-xs text-ink/50 mb-6 max-w-xl">
        Note: the homepage stat counter (quote requests received) is calculated
        automatically from real submissions and isn&apos;t edited here.
      </p>

      <div className="stack-card-light p-5 flex flex-col gap-4">
        {keys.map((key) => (
          <div key={key}>
            <label className="text-xs font-medium block mb-1.5">{SETTING_LABELS[key]}</label>
            {key === "hero_subtext" || key === "footer_tagline" ? (
              <textarea
                className="input-field min-h-[70px]"
                value={values[key] || ""}
                onChange={(e) => setValues((prev) => ({ ...prev, [key]: e.target.value }))}
              />
            ) : (
              <input
                className="input-field"
                value={values[key] || ""}
                onChange={(e) => setValues((prev) => ({ ...prev, [key]: e.target.value }))}
              />
            )}
          </div>
        ))}
        <div className="flex items-center gap-3 mt-2">
          <button onClick={handleSave} disabled={saving} className="btn-primary font-display uppercase text-xs tracking-wide px-5 py-2.5 rounded-sm">
            {saving ? "Saving…" : "Save changes"}
          </button>
          {saved && <span className="text-xs text-emerald-700 font-medium">Saved.</span>}
        </div>
      </div>
    </div>
  );
}
