import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 30;

export default async function Home() {
  const supabase = await createClient();
  const { data: hours } = await supabase
    .from("loom_hours")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);
  const hour = hours?.[0];

  const { data: slips } = await supabase
    .from("loom_slips")
    .select("id, title, body, created_at, author_id")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(24);

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="wrap">
      <nav className="nav">
        <Link className="mark" href="/">Loom</Link>
        <div className="nav-links">
          <Link href="/desk">Desk</Link>
          {user ? <Link href="/desk">Signed in</Link> : <Link href="/login">Sign in</Link>}
        </div>
      </nav>

      <section className="hero">
        <p className="kicker">This hour</p>
        <h1>{hour?.title ?? "The press is warming up"}</h1>
        <p className="lede">
          {hour?.body ??
            "Every hour a new dispatch lands here. Leave a slip at the desk. Mark it public and it hangs on the wall."}
        </p>
        <p className="meta" style={{ marginTop: 14 }}>
          {hour?.hour_key ? `Edition ${hour.hour_key}` : "Waiting on the next bell"}
        </p>
      </section>

      <div className="grid">
        <section className="card">
          <p className="kicker">The wall</p>
          <h2>Public slips</h2>
          <div className="slips">
            {(slips ?? []).length === 0 && (
              <p className="meta">Nothing public yet. Be the first at the desk.</p>
            )}
            {(slips ?? []).map((s, i) => (
              <article className="slip" key={s.id} style={{ animationDelay: `${i * 60}ms` }}>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <p className="meta">{new Date(s.created_at).toLocaleString()}</p>
              </article>
            ))}
          </div>
        </section>
        <aside className="card">
          <p className="kicker">How it works</p>
          <h2>Write, keep, or hang</h2>
          <p className="lede" style={{ fontSize: 16 }}>
            Sign in with a magic link. Your slips save to your account. Flip the public switch
            and they appear on this wall. Private ones stay only on your desk.
          </p>
          <p style={{ marginTop: 18 }}>
            <Link className="btn" href="/desk">Go to the desk</Link>
          </p>
        </aside>
      </div>
    </main>
  );
}
