import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/app");

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "var(--black)", maxWidth: 430, margin: "0 auto" }}
    >
      {/* Logo */}
      <div
        className="font-raleway font-black text-5xl tracking-widest mb-2"
        style={{ color: "var(--green)" }}
      >
        CH<span style={{ color: "var(--yellow)" }}>I</span>P
      </div>
      <p className="text-xs tracking-widest uppercase mb-12" style={{ color: "var(--text-muted)" }}>
        Golf Fitness Tracker
      </p>

      {/* Hero */}
      <div className="mb-10">
        <h1 className="font-raleway font-black text-3xl leading-tight mb-4" style={{ color: "var(--text)" }}>
          Train Like Your<br />
          <span style={{ color: "var(--green)" }}>Game Depends On It</span>
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Golf-specific workouts: speed, strength, power, and recovery.
          Built for golfers who take their performance seriously.
        </p>
      </div>

      {/* Features */}
      <div className="w-full grid grid-cols-2 gap-3 mb-10">
        {[
          { icon: "⚡", label: "Speed Days", sub: "Explosive power" },
          { icon: "💪", label: "Strength Days", sub: "Build the base" },
          { icon: "🔥", label: "Power Days", sub: "Max golf speed" },
          { icon: "🌊", label: "Recovery Days", sub: "Move easy, restore" },
        ].map((f) => (
          <div
            key={f.label}
            className="rounded-2xl p-4 text-left"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div className="text-xl mb-1">{f.icon}</div>
            <div className="font-raleway font-bold text-sm" style={{ color: "var(--text)" }}>
              {f.label}
            </div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              {f.sub}
            </div>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="w-full space-y-3">
        <Link
          href="/signup"
          className="block w-full py-4 rounded-2xl font-raleway font-black text-base text-black text-center"
          style={{
            background: "linear-gradient(135deg, var(--green), var(--green-bright))",
            boxShadow: "0 4px 20px rgba(0,175,81,0.3)",
          }}
        >
          START TRAINING
        </Link>
        <Link
          href="/login"
          className="block w-full py-4 rounded-2xl font-raleway font-black text-base text-center"
          style={{
            background: "var(--card2)",
            border: "1px solid var(--border)",
            color: "var(--text-dim)",
          }}
        >
          SIGN IN
        </Link>
      </div>
    </div>
  );
}
