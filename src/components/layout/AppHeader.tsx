"use client";

export function AppHeader() {
  const now = new Date();
  const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-5"
      style={{
        height: 60,
        background: "rgba(13,13,13,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        className="font-raleway font-black text-2xl tracking-widest"
        style={{ color: "var(--green)" }}
      >
        CH<span style={{ color: "var(--yellow)" }}>I</span>P
      </div>
      <div className="text-right text-xs leading-tight">
        <strong className="block font-semibold" style={{ color: "var(--text-dim)" }}>
          {weekday}
        </strong>
        <span style={{ color: "var(--text-muted)" }}>{dateStr}</span>
      </div>
    </header>
  );
}
