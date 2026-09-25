"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${origin}/auth/callback` },
    });
    setBusy(false);
    setMsg(error ? error.message : "Check your inbox. The link is good for a short while.");
  }

  return (
    <main className="wrap">
      <nav className="nav">
        <Link className="mark" href="/">Loom</Link>
        <div className="nav-links"><Link href="/">Wall</Link></div>
      </nav>
      <section className="hero">
        <p className="kicker">Entrance</p>
        <h1>Sign in</h1>
        <p className="lede">No password. We send a one-time link to your email.</p>
      </section>
      <section className="card" style={{ maxWidth: 460 }}>
        <form onSubmit={send}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          <button disabled={busy} type="submit">{busy ? "Sending…" : "Send the link"}</button>
          <p className="flash">{msg}</p>
        </form>
      </section>
    </main>
  );
}
