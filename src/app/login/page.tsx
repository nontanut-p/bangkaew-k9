"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@bangkaew.local");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Login failed");
      return;
    }
    router.push(data.redirect ?? "/demo");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 p-4">
      <div className="bg-grid-pattern fixed inset-0 opacity-30" />
      <form onSubmit={handleSubmit} className="glass-card relative w-full max-w-md space-y-4 p-8">
        <h1 className="text-2xl font-bold text-white">Log in — Bangkaew K9</h1>
        <p className="text-sm text-slate-400">
          Demo account: <code className="text-cyan-400">demo@bangkaew.local</code> /{" "}
          <code className="text-cyan-400">demo1234</code>
        </p>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <label className="block">
          <span className="text-xs text-slate-400">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-navy-900 px-3 py-2 text-white"
          />
        </label>
        <label className="block">
          <span className="text-xs text-slate-400">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-navy-900 px-3 py-2 text-white"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-cyan-600 py-2.5 font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Log in"}
        </button>
        <p className="text-center text-xs text-slate-500">
          New here?{" "}
          <Link href="/register" className="text-cyan-400 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
