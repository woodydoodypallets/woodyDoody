"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ContentItem, ContentSection } from "@/lib/api";

type FieldConfig = {
  key: "title" | "subtitle" | "body" | "image_url" | "link_url";
  label: string;
  type?: "text" | "textarea" | "url";
};

const SECTION_CONFIG: Record<ContentSection, { label: string; fields: FieldConfig[]; extraFields?: { key: string; label: string }[] }> = {
  service: {
    label: "Services",
    fields: [
      { key: "title", label: "Title" },
      { key: "body", label: "Description", type: "textarea" },
      { key: "image_url", label: "Image path (e.g. /images/foo.jpg)", type: "url" },
    ],
  },
  industry: {
    label: "Industries",
    fields: [
      { key: "title", label: "Industry name" },
      { key: "body", label: "Description", type: "textarea" },
    ],
  },
  faq: {
    label: "FAQ",
    fields: [
      { key: "title", label: "Question" },
      { key: "body", label: "Answer", type: "textarea" },
    ],
    extraFields: [{ key: "group", label: "Group (e.g. 'Ordering & delivery')" }],
  },
  product: {
    label: "Products",
    fields: [
      { key: "title", label: "Product name" },
      { key: "subtitle", label: "Spec (e.g. '48×40 GMA')" },
      { key: "body", label: "Description", type: "textarea" },
    ],
  },
  gallery: {
    label: "Gallery",
    fields: [
      { key: "title", label: "Caption" },
      { key: "image_url", label: "Image path", type: "url" },
    ],
  },
  testimonial: {
    label: "Testimonials",
    fields: [
      { key: "title", label: "Customer name" },
      { key: "subtitle", label: "Role / company" },
      { key: "body", label: "Quote", type: "textarea" },
    ],
    extraFields: [{ key: "rating", label: "Star rating (1-5)" }],
  },
  nav_item: {
    label: "Navigation menu",
    fields: [
      { key: "title", label: "Label" },
      { key: "link_url", label: "Link (e.g. /services)", type: "url" },
    ],
  },
  footer_link: {
    label: "Footer links",
    fields: [
      { key: "title", label: "Label" },
      { key: "link_url", label: "Link", type: "url" },
    ],
    extraFields: [{ key: "column", label: "Footer column (e.g. 'Company')" }],
  },
  office_location: {
    label: "Contact locations",
    fields: [
      { key: "title", label: "Office name" },
      { key: "body", label: "Address", type: "textarea" },
      { key: "link_url", label: "Google Maps link (or address to search)", type: "url" },
    ],
    extraFields: [
      { key: "type", label: "Type: 'Head Office' or 'Branch Office'" },
      { key: "phone", label: "Phone number" },
      { key: "email", label: "Email address" },
    ],
  },
};

const emptyForm = {
  title: "", subtitle: "", body: "", image_url: "", link_url: "", extraValues: {} as Record<string, string>,
};

export default function ContentManager({ section }: { section: ContentSection }) {
  const router = useRouter();
  const config = SECTION_CONFIG[section];
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await api.admin.listContent(section);
      setItems(data);
    } catch {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [section]);

  function startEdit(item: ContentItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      subtitle: item.subtitle || "",
      body: item.body || "",
      image_url: item.image_url || "",
      link_url: item.link_url || "",
      extraValues: Object.fromEntries(
        (config.extraFields || []).map((f) => [f.key, item.extra?.[f.key] != null ? String(item.extra[f.key]) : ""])
      ),
    });
  }

  function startNew() {
    setEditingId("new");
    setForm(emptyForm);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  }

  async function handleSave() {
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    setError(null);
    const payload = {
      title: form.title,
      subtitle: form.subtitle || undefined,
      body: form.body || undefined,
      image_url: form.image_url || undefined,
      link_url: form.link_url || undefined,
      extra: Object.keys(form.extraValues).length ? form.extraValues : undefined,
    };
    try {
      if (editingId === "new") {
        await api.admin.createContent({ section, ...payload, order_index: items.length });
      } else if (typeof editingId === "number") {
        await api.admin.updateContent(editingId, payload);
      }
      cancelEdit();
      load();
    } catch (err: any) {
      setError(err.message || "Could not save.");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    await api.admin.deleteContent(id);
    load();
  }

  async function handleToggleActive(item: ContentItem) {
    await api.admin.updateContent(item.id, { is_active: !item.is_active });
    load();
  }

  async function handleMove(item: ContentItem, direction: -1 | 1) {
    const sorted = [...items].sort((a, b) => a.order_index - b.order_index);
    const idx = sorted.findIndex((i) => i.id === item.id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const other = sorted[swapIdx];
    await Promise.all([
      api.admin.updateContent(item.id, { order_index: other.order_index }),
      api.admin.updateContent(other.id, { order_index: item.order_index }),
    ]);
    load();
  }

  const isEditing = editingId !== null;

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <span className="font-display uppercase text-xs tracking-widest text-rust">Content</span>
          <h1 className="font-display uppercase text-3xl font-bold mt-1">{config.label}</h1>
        </div>
        {!isEditing && (
          <button onClick={startNew} className="btn-primary font-display uppercase text-xs tracking-wide px-4 py-2.5 rounded-sm">
            + Add new
          </button>
        )}
      </div>

      {isEditing && (
        <div className="stack-card-light p-5 mb-6">
          <h2 className="font-display uppercase text-sm mb-4">{editingId === "new" ? "New item" : "Edit item"}</h2>
          {error && <p className="text-rust text-sm bg-rust/10 border border-rust/20 rounded-sm px-3 py-2 mb-3">{error}</p>}
          <div className="flex flex-col gap-3">
            {config.fields.map((f) => (
              <div key={f.key}>
                <label className="text-xs font-medium block mb-1.5">{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea
                    className="input-field min-h-[80px]"
                    value={form[f.key]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  />
                ) : (
                  <input
                    className="input-field"
                    value={form[f.key]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  />
                )}
              </div>
            ))}
            {(config.extraFields || []).map((f) => (
              <div key={f.key}>
                <label className="text-xs font-medium block mb-1.5">{f.label}</label>
                <input
                  className="input-field"
                  value={form.extraValues[f.key] || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, extraValues: { ...prev.extraValues, [f.key]: e.target.value } }))}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} className="btn-primary font-display uppercase text-xs tracking-wide px-4 py-2.5 rounded-sm">
              Save
            </button>
            <button onClick={cancelEdit} className="font-display uppercase text-xs tracking-wide px-4 py-2.5 rounded-sm border-2 border-ink/15 hover:border-ink/30">
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading && <span className="font-display uppercase text-sm tracking-widest text-ink/40">Loading…</span>}

      {!loading && (
        <div className="flex flex-col gap-2">
          {items.length === 0 && <p className="text-ink/50 text-sm">No items yet — add one above.</p>}
          {[...items].sort((a, b) => a.order_index - b.order_index).map((item, idx, arr) => (
            <div key={item.id} className={`stack-card-light p-4 flex items-center gap-3 ${!item.is_active ? "opacity-50" : ""}`}>
              <div className="flex flex-col gap-0.5 shrink-0">
                <button onClick={() => handleMove(item, -1)} disabled={idx === 0} className="text-xs text-ink/40 hover:text-amberdeep disabled:opacity-20">▲</button>
                <button onClick={() => handleMove(item, 1)} disabled={idx === arr.length - 1} className="text-xs text-ink/40 hover:text-amberdeep disabled:opacity-20">▼</button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display uppercase text-sm truncate">{item.title}</div>
                {item.subtitle && <div className="text-xs text-ink/50 truncate">{item.subtitle}</div>}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleToggleActive(item)} className="text-xs font-display uppercase tracking-wide text-ink/50 hover:text-amberdeep">
                  {item.is_active ? "Hide" : "Show"}
                </button>
                <button onClick={() => startEdit(item)} className="text-xs font-display uppercase tracking-wide text-amberdeep hover:underline">
                  Edit
                </button>
                <button onClick={() => handleDelete(item.id)} className="text-xs font-display uppercase tracking-wide text-rust hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
