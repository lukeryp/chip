"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_SCHEDULE } from "@/lib/protocols";
import type { WeekSchedule, ProtocolType } from "@/types/workout";
import type { Database } from "@/types/database";

type ScheduleRow = Database["public"]["Tables"]["user_schedules"]["Row"];
type SettingsRow = Database["public"]["Tables"]["user_settings"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

interface SettingsViewProps {
  scheduleRows: ScheduleRow[];
  settings: SettingsRow | null;
  profile: ProfileRow | null;
  userId: string;
  userEmail: string;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const PROTOCOL_OPTIONS: Array<{ value: ProtocolType | null; label: string; color: string }> = [
  { value: null, label: "REST", color: "var(--text-muted)" },
  { value: "speed", label: "SPEED", color: "#f4ee19" },
  { value: "strength", label: "STRENGTH", color: "#00af51" },
  { value: "power", label: "POWER", color: "#ff6432" },
  { value: "recovery", label: "RECOVERY", color: "#6699ff" },
];

const PROTOCOL_COLORS: Record<string, string> = {
  speed: "rgba(244,238,25,0.12)",
  strength: "rgba(0,175,81,0.12)",
  power: "rgba(255,100,50,0.12)",
  recovery: "rgba(100,150,255,0.1)",
};
const PROTOCOL_BORDERS: Record<string, string> = {
  speed: "#c9c412",
  strength: "#007a38",
  power: "#aa3322",
  recovery: "#3355aa",
};

function buildSchedule(rows: ScheduleRow[]): WeekSchedule {
  if (rows.length === 0) return { ...DEFAULT_SCHEDULE };
  const schedule: WeekSchedule = { ...DEFAULT_SCHEDULE };
  for (const row of rows) {
    schedule[row.day_of_week] = row.protocol as ProtocolType | null;
  }
  return schedule;
}

export function SettingsView({ scheduleRows, settings, profile, userId, userEmail }: SettingsViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [schedule, setSchedule] = useState<WeekSchedule>(buildSchedule(scheduleRows));
  const [notifications, setNotifications] = useState(settings?.notifications_enabled ?? false);
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function cycleProtocol(dow: number) {
    const current = schedule[dow] ?? null;
    const options: Array<ProtocolType | null> = [null, "strength", "speed", "power", "recovery"];
    const idx = options.indexOf(current);
    const next = options[(idx + 1) % options.length] ?? null;
    setSchedule((prev) => ({ ...prev, [dow]: next }));
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schedule,
          notificationsEnabled: notifications,
          displayName: displayName.trim() || null,
        }),
      });
      if (res.ok) {
        setSaved(true);
        startTransition(() => router.refresh());
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="p-4">
      {/* Profile */}
      <div
        className="rounded-2xl p-4 mb-4"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
          Profile
        </div>
        <div className="mb-3">
          <label className="block text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            maxLength={50}
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: "var(--card2)", border: "1px solid var(--border)", color: "var(--text)" }}
            onFocus={(e) => (e.target.style.borderColor = "var(--green)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{userEmail}</p>
      </div>

      {/* Weekly schedule */}
      <div
        className="rounded-2xl p-4 mb-4"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
          Weekly Schedule
        </div>
        <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
          Tap a day to cycle through protocols.
        </p>

        {/* Legend */}
        <div className="flex gap-2 flex-wrap mb-4">
          {PROTOCOL_OPTIONS.map((p) => (
            <div key={p.value ?? "rest"} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{p.label}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-1.5">
          {DAYS.map((day, dow) => {
            const proto = schedule[dow] ?? null;
            const bg = proto ? PROTOCOL_COLORS[proto] ?? "var(--card)" : "var(--card)";
            const border = proto ? PROTOCOL_BORDERS[proto] ?? "var(--border)" : "var(--border)";
            const color = PROTOCOL_OPTIONS.find((p) => p.value === proto)?.color ?? "var(--text-muted)";

            return (
              <button
                key={dow}
                onClick={() => cycleProtocol(dow)}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <span className="text-xs font-semibold uppercase" style={{ color: "var(--text-muted)" }}>
                  {day}
                </span>
                <div
                  className="w-full rounded-lg flex items-center justify-center text-center transition-all"
                  style={{
                    aspectRatio: "1",
                    background: bg,
                    border: `1px solid ${border}`,
                    color,
                    fontSize: 8,
                    fontWeight: 600,
                    lineHeight: 1.2,
                    padding: 2,
                  }}
                >
                  {proto ? proto.slice(0, 3).toUpperCase() : "—"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preferences */}
      <div
        className="rounded-2xl p-4 mb-4"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
          Preferences
        </div>

        <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <div className="text-sm font-medium">Notifications</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>Daily workout reminders</div>
          </div>
          <button
            onClick={() => setNotifications((n) => !n)}
            className="w-11 h-6.5 rounded-full relative transition-colors"
            style={{
              background: notifications ? "var(--green)" : "var(--card3)",
              border: `1px solid ${notifications ? "var(--green)" : "var(--border)"}`,
              width: 44,
              height: 26,
            }}
          >
            <span
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform"
              style={{
                left: notifications ? 20 : 2,
                top: 3,
                transition: "left 0.2s",
              }}
            />
          </button>
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-4 rounded-2xl font-raleway font-black text-base text-black mb-3 transition-opacity disabled:opacity-50"
        style={{
          background: "linear-gradient(135deg, var(--green), var(--green-bright))",
          boxShadow: "0 4px 20px rgba(0,175,81,0.3)",
        }}
      >
        {saving ? "SAVING..." : saved ? "SAVED ✓" : "SAVE SETTINGS"}
      </button>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-colors"
        style={{ background: "var(--card2)", border: "1px solid var(--border)", color: "var(--text-dim)" }}
      >
        Sign Out
      </button>
    </div>
  );
}
