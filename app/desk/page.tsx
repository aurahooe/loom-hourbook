"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Slip = {
  id: string;
  title: string;
  body: string;
  is_public: boolean;
  created_at: string;
};

export default function DeskPage() {
  const supabase = createClient();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [slips, setSlips] = useState<Slip[]>([]);
  const [msg, setMsg] = useState("");

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    setEmail(user?.email ?? null);
    setReady(true);
    if (!user) return;
    const { data } = await supabase
      .from("loom_slips")
      .select("id, title, body, is_public, created_at")
      .eq("author_id", user.id)
      .order("created_at", { ascending: false });
    setSlips(data ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMsg("Sign in first.");
      return;
    }
    const handle = (user.email ?? "anon").split("@")[0].slice(0, 24);
    await supabase.from("loom_profiles").upsert({
      id: user.id,
      handle,
      display_name: handle,
    });
    const { error } = await supabase.from("loom_slips").insert({
      author_id: user.id,
      title,
      body,
      is_public: isPublic,
    });
    if (error) {
      setMsg(error.message);
      return;
    }
    setTitle("");
    setBody("");
    setIsPublic(false);
    setMsg(isPublic ? "Hung on the wall." : "Kept at your desk.");
    load();
  }

  async function toggle(slip: Slip) {
    await supabase.from("loom_slips").update({ is_public: !slip.is_public }).eq("id", slip.id);
    load();
  }

  async function remove(id: string) {
    await supabase.from("loom_slips").delete().eq("id", id);
    load();
  }

  async function out() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (!ready) {
    return (
      <main className="wrap">
        <p className="meta">Pulling up the desk…</p>
      </main>
    );
  }

  if (!email) {
    return (
      <main className="wrap">
        <nav className="nav">
          <Link className="mark" href="/">Loom</Link>
        </nav>
        <section className="hero">
          <h1>The desk is locked</h1>
          <p className="lede">Sign in to write and to decide what the wall can see.</p>
          <Link className="btn" href="/login">Sign in</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="wrap">
      <nav className="nav">
        <Link className="mark" href="/">Loom</Link>
        <div className="nav-links">
          <Link href="/">Wall</Link>
          <button onClick={out} style={{ background: "transparent", color: "inherit", border: 0, padding: 0 }}>
            Sign out
          </button>
        </div>
      </nav>
      <section className="hero">
        <p className="kicker">{email}</p>
        <h1>Your desk</h1>
        <p className="lede">Write something. Keep it, or hang it.</p>
      </section>
      <div className="grid">
        <section className="card">
          <form onSubmit={save}>
            <label htmlFor="title">Title</label>
            <input id="title" required maxLength={140} value={title} onChange={(e) => setTitle(e.target.value)} />
            <label htmlFor="body">Slip</label>
            <textarea id="body" required maxLength={8000} value={body} onChange={(e) => setBody(e.target.value)} />
            <label className="check">
              <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
              Hang this on the public wall
            </label>
            <button type="submit">Save slip</button>
            <p className="flash">{msg}</p>
          </form>
        </section>
        <section className="card">
          <p className="kicker">Saved</p>
          <h2>Your slips</h2>
          <div className="slips">
            {slips.length === 0 && <p className="meta">Empty drawer.</p>}
            {slips.map((s) => (
              <article className="slip" key={s.id}>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <p className="meta">{s.is_public ? "Public" : "Private"} · {new Date(s.created_at).toLocaleString()}</p>
                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  <button type="button" onClick={() => toggle(s)}>
                    {s.is_public ? "Make private" : "Make public"}
                  </button>
                  <button type="button" onClick={() => remove(s.id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
