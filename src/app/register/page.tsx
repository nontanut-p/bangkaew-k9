"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    org_name: "",
    admin_name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        org_name: form.org_name,
        admin_name: form.admin_name,
        email: form.email,
        password: form.password,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Registration failed");
      return;
    }
    router.push(data.redirect ?? "/onboarding");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 p-4">
      <div className="bg-grid-pattern fixed inset-0 opacity-30" />
      <form onSubmit={handleSubmit} className="glass-card relative w-full max-w-md space-y-4 p-8">
        <h1 className="text-2xl font-bold text-white">Register — Bangkaew K9</h1>
        <p className="text-sm text-slate-400">Create your organization demo account</p>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {(
          [
            ["org_name", "Organization name"],
            ["admin_name", "Admin name"],
            ["email", "Email"],
            ["password", "Password", "password"],
            ["confirm", "Confirm password", "password"],
          ] as const
        ).map(([key, label, type]) => (
          <label key={key} className="block">
            <span className="text-xs text-slate-400">{label}</span>
            <input
              type={type ?? "text"}
              required
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="mt-1 w-full rounded-lg border border-white/10 bg-navy-900 px-3 py-2 text-white"
            />
          </label>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-cyan-600 py-2.5 font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
        >
          {loading ? "Creating…" : "Sign up"}
        </button>
        <p className="text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-400 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
