// Two different base URLs are needed:
// - NEXT_PUBLIC_API_URL: used by the BROWSER (login, quote form, admin panel).
//   Must be the URL reachable from the user's machine — the mapped host port,
//   OR an empty string "" for same-origin routing (e.g. behind a reverse
//   proxy like Caddy/Nginx that forwards /api/* to the backend on the same
//   domain — the standard pattern for a single-domain VPS deployment).
// - API_URL_INTERNAL: used by the Next.js SERVER itself (fetchContent/fetchSettings,
//   called from Server Components during rendering). This runs inside the frontend
//   Docker container, where "localhost" refers to that container, not the backend
//   one — it needs the Docker Compose service name instead (e.g. "http://backend:8000").
//
// Note: these intentionally use `??` (nullish coalescing), not `||`. With
// `||`, an explicitly-set empty string ("" — used for same-origin routing)
// is falsy and would incorrectly fall through to the localhost default.
// `??` only falls through when the variable is actually unset.
const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const SERVER_API_URL = process.env.API_URL_INTERNAL ?? PUBLIC_API_URL;

function getApiUrl(): string {
  // No `window` means this code is running server-side (Node.js), not in the browser.
  return typeof window === "undefined" ? SERVER_API_URL : PUBLIC_API_URL;
}

export type TokenPair = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type AdminUser = {
  id: number;
  full_name: string;
  email: string;
  role: "admin";
  is_active: boolean;
  created_at: string;
};

export type PalletType = "New" | "Used" | "Remanufactured";
export type QuoteStatus = "New" | "In Progress" | "Completed";

export type QuoteSubmission = {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  pallet_size: string;
  quantity: number;
  address?: string;
  address_line_2?: string;
  city?: string;
  state_province_region?: string;
  postal_zip_code?: string;
  country?: string;
  decking_dimensions?: string;
  pallet_type?: PalletType;
  method_of_delivery?: string;
  message?: string;
};

export type Quote = QuoteSubmission & {
  id: number;
  quote_request_id: string;
  status: QuoteStatus;
  admin_note?: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminStats = {
  total_quotes: number;
  new_quotes: number;
  in_progress_quotes: number;
  completed_quotes: number;
};

export type ContentSection =
  | "service" | "industry" | "faq" | "product" | "gallery"
  | "testimonial" | "nav_item" | "footer_link" | "office_location";

export type ContentItem = {
  id: number;
  section: ContentSection;
  title: string;
  subtitle?: string | null;
  body?: string | null;
  image_url?: string | null;
  link_url?: string | null;
  extra?: Record<string, any> | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type SiteSetting = { key: string; value?: string | null };

/** Fetches all active items in a section. Server-side callers should pass
 * { cache: "no-store" } via the optional init param so content edited in
 * the admin panel shows up without a redeploy. */
export async function fetchContent(section: ContentSection, init?: RequestInit): Promise<ContentItem[]> {
  try {
    const res = await fetch(`${getApiUrl()}/api/content?section=${section}`, {
      cache: "no-store",
      ...init,
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    // Network failure (backend unreachable, DNS failure, timeout, etc).
    // This must NEVER throw — layout.tsx calls this on every single page
    // load, so an unhandled exception here would 500 the entire site,
    // including the health check route, any time the backend is briefly
    // unreachable. Degrade to empty content instead.
    console.error(`fetchContent(${section}) failed:`, err);
    return [];
  }
}

export async function fetchSettings(init?: RequestInit): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${getApiUrl()}/api/content/settings`, {
      cache: "no-store",
      ...init,
    });
    if (!res.ok) return {};
    const list: SiteSetting[] = await res.json();
    const map: Record<string, string> = {};
    for (const s of list) map[s.key] = s.value || "";
    return map;
  } catch (err) {
    console.error("fetchSettings failed:", err);
    return {};
  }
}

/** Genuine, real numbers only — no fabricated stats. Returns the actual
 * count of quote requests received so far. */
export async function fetchPublicStats(init?: RequestInit): Promise<{ quote_count: number }> {
  try {
    const res = await fetch(`${getApiUrl()}/api/content/stats`, {
      cache: "no-store",
      ...init,
    });
    if (!res.ok) return { quote_count: 0 };
    return await res.json();
  } catch (err) {
    console.error("fetchPublicStats failed:", err);
    return { quote_count: 0 };
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${getApiUrl()}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    let detail = "Request failed";
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch {
      // ignore
    }
    throw new Error(detail);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  // Public — no account required
  submitQuote: (data: QuoteSubmission) =>
    request<Quote>("/api/quotes", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Admin auth
  login: async (email: string, password: string) => {
    const tokens = await request<TokenPair>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
    return tokens;
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },

  me: () => request<AdminUser>("/api/auth/me"),

  // Admin-only quote management
  admin: {
    stats: () => request<AdminStats>("/api/admin/stats"),
    quotes: (status?: string, search?: string) => {
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (search) params.set("search", search);
      const qs = params.toString();
      return request<Quote[]>(`/api/admin/quotes${qs ? `?${qs}` : ""}`);
    },
    getQuote: (id: number) => request<Quote>(`/api/admin/quotes/${id}`),
    updateQuote: (id: number, data: { status?: string; admin_note?: string }) =>
      request<Quote>(`/api/admin/quotes/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    deleteQuote: (id: number) =>
      request<void>(`/api/admin/quotes/${id}`, { method: "DELETE" }),

    // Content (CMS)
    listContent: (section?: ContentSection) =>
      request<ContentItem[]>(`/api/admin/content${section ? `?section=${section}` : ""}`),
    createContent: (data: Partial<ContentItem> & { section: ContentSection; title: string }) =>
      request<ContentItem>("/api/admin/content", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateContent: (id: number, data: Partial<ContentItem>) =>
      request<ContentItem>(`/api/admin/content/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    deleteContent: (id: number) =>
      request<void>(`/api/admin/content/${id}`, { method: "DELETE" }),

    // Settings
    listSettings: () => request<SiteSetting[]>("/api/admin/content/settings/all"),
    updateSettings: (settings: Record<string, string>) =>
      request<SiteSetting[]>("/api/admin/content/settings/all", {
        method: "PUT",
        body: JSON.stringify({ settings }),
      }),
  },
};

export function isLoggedIn(): boolean {
  return !!getToken();
}
