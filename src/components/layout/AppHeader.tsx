"use client";

import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/app": "Today",
  "/app/calendar": "Calendar",
  "/app/stats": "Stats",
  "/app/settings": "Settings",
};

export function AppHeader() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "CHIP";

  return (
    <header
      className="sticky top-0 z-100 flex items-center justify-center"
      style={{
        height: "var(--header-h)",
        background: "rgba(13,13,13,0.97)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <span
        className="text-sm font-semibold tracking-widest uppercase"
        style={{ color: "var(--text-muted)" }}
      >
        {title}
      </span>
    </header>
  );
}
