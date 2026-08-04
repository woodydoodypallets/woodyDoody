"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.login(email, password);
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-ink floor-grid px-5">
      <div className="w-full max-w-sm glass rounded-sm p-8">
        <Image src="/images/logo.png" alt="Woody Doody Pallets" width={44} height={44} className="w-10 h-10 object-contain mb-6" />
        <h1 className="font-display uppercase text-2xl font-bold text-white mb-1">Admin login</h1>
        <p className="text-sm text-mist mb-7">Staff access only.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <p className="text-rust text-sm bg-rust/10 border border-rust/20 rounded-sm px-3 py-2">{error}</p>
          )}
          <div>
            <label className="text-xs font-medium text-mist block mb-1.5">Email</label>
            <input required type="email" className="input-field-dark"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-mist block mb-1.5">Password</label>
            <input required type="password" className="input-field-dark"
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button disabled={loading} className="btn-primary font-display uppercase text-sm tracking-wide px-4 py-3 rounded-sm mt-2">
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
