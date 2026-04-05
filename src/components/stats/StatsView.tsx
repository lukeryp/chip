"use client";

import { useMemo } from "react";
import { BADGES, PROTOCOLS } from "@/lib/protocols";
import {
  calculateCurrentStreak,
  calculateBestStreak,
  countWeekWorkouts,
  monthCompletionRate,
  formatDate,
} from "@/lib/streak";
import { DEFAULT_SCHEDULE } from "@/lib/protocols";
import type { WeekSchedule, ProtocolType } from "@/types/workout";
import type { Database } from "@/types/database";

type ScheduleRow = Database["public"]["Tables"]["user_schedules"]["Row"];

interface LogEntry {
  workout_date: string;
  completed: boolean;
  protocol: string;
  duration_seconds: number | null;
}

interface StatsViewProps {
  logs: LogEntry[];
  scheduleRows: ScheduleRow[];
}

function buildSchedule(rows: ScheduleRow[]): WeekSchedule {
  if (rows.length === 0) return DEFAULT_SCHEDULE;
  const schedule: WeekSchedule = { ...DEFAULT_SCHEDULE };
  for (const row of rows) {
    schedule[row.day_of_week] = row.protocol as ProtocolType | null;
  }
  return schedule;
}

function getWeekKey(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const mon = new Date(d);
  mon.setDate(d.getDate() - d.getDay());
  return formatDate(mon);
}

export function StatsView({ logs, scheduleRows }: StatsViewProps) {
  const schedule = buildSchedule(scheduleRows);

  const completedLogs = useMemo(() => logs.filter((l) => l.completed), [logs]);
  const completedSet = useMemo(() => new Set(completedLogs.map((l) => l.workout_date)), [completedLogs]);
  const allDates = useMemo(() => logs.map((l) => l.workout_date), [logs]);

  const currentStreak = useMemo(() => calculateCurrentStreak(completedSet, schedule), [completedSet, schedule]);
  const bestStreak = useMemo(() => calculateBestStreak(completedSet, schedule, allDates), [completedSet, schedule, allDates]);
  const weekWorkouts = useMemo(() => countWeekWorkouts(completedSet), [completedSet]);
  const completionRate = useMemo(() => monthCompletionRate(completedSet, schedule), [completedSet, schedule]);

  // Protocol breakdown
  const protocolCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const log of completedLogs) {
      counts[log.protocol] = (counts[log.protocol] ?? 0) + 1;
    }
    return counts;
  }, [completedLogs]);

  // Weekly workout counts (last 12 weeks)
  const weeklyData = useMemo(() => {
    const weekMap: Record<string, number> = {};
    for (const log of completedLogs) {
      const key = getWeekKey(log.workout_date);
      weekMap[key] = (weekMap[key] ?? 0) + 1;
    }
    const weeks: Array<{ label: string; count: number }> = [];
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
      const mon = new Date(today);
      mon.setDate(today.getDate() - today.getDay() - i * 7);
      const key = formatDate(mon);
      const label = `W${12 - i}`;
      weeks.push({ label, count: weekMap[key] ?? 0 });
    }
    return weeks;
  }, [completedLogs]);

  const maxWeekly = Math.max(...weeklyData.map((w) => w.count), 1);

  // Badge evaluation
  const earnedBadges = useMemo(() =>
    BADGES.filter((b) => b.check(completedSet.size, currentStreak, weekWorkouts)),
    [completedSet.size, currentStreak, weekWorkouts]
  );
  const earnedIds = new Set(earnedBadges.map((b) => b.id));

  return (
    <div className="p-4">
      {/* Big stats */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {[
          { val: completedSet.size, lbl: "Total Workouts", color: "var(--green)" },
          { val: currentStreak, lbl: "Current Streak", color: "var(--green)" },
          { val: bestStreak, lbl: "Best Streak", color: "var(--yellow)" },
          { val: `${completionRate}%`, lbl: "30-Day Rate", color: "var(--green)" },
        ].map(({ val, lbl, color }) => (
          <div
            key={lbl}
            className="rounded-2xl p-4"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div className="font-raleway font-black text-3xl leading-none" style={{ color }}>
              {val}
            </div>
            <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Weekly trend */}
      <div
        className="rounded-2xl p-4 mb-4"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-dim)" }}>
          Weekly Workouts
        </div>
        <div className="flex items-end gap-1" style={{ height: 60 }}>
          {weeklyData.map((w, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm relative group"
              style={{
                height: `${Math.max((w.count / maxWeekly) * 100, 4)}%`,
                background: i === weeklyData.length - 1 ? "var(--green)" : "var(--card3)",
                minHeight: 4,
                borderRadius: "4px 4px 0 0",
              }}
              title={`${w.label}: ${w.count} workout${w.count !== 1 ? "s" : ""}`}
            />
          ))}
        </div>
        <div className="flex mt-1.5">
          {weeklyData.map((w, i) => (
            <div
              key={i}
              className="flex-1 text-center"
              style={{ fontSize: 8, color: i === weeklyData.length - 1 ? "var(--green)" : "var(--text-muted)" }}
            >
              {i % 3 === 0 ? w.label : ""}
            </div>
          ))}
        </div>
      </div>

      {/* Protocol breakdown */}
      <div
        className="rounded-2xl p-4 mb-4"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-dim)" }}>
          By Protocol
        </div>
        <div className="space-y-3">
          {Object.entries(PROTOCOLS).map(([key, proto]) => {
            const count = protocolCounts[key] ?? 0;
            const maxCount = Math.max(...Object.values(protocolCounts), 1);
            return (
              <div key={key}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold" style={{ color: proto.color }}>{proto.label}</span>
                  <span style={{ color: "var(--text-muted)" }}>{count}</span>
                </div>
                <div className="rounded-full h-1.5" style={{ background: "var(--card3)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(count / maxCount) * 100}%`, background: proto.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges */}
      <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
        Badges
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {BADGES.map((badge) => {
          const earned = earnedIds.has(badge.id);
          return (
            <div
              key={badge.id}
              className="rounded-2xl p-3.5 text-center transition-opacity"
              style={{
                background: earned ? "rgba(244,238,25,0.06)" : "var(--card)",
                border: `1px solid ${earned ? "var(--yellow-dim)" : "var(--border)"}`,
                opacity: earned ? 1 : 0.4,
              }}
            >
              <span className="text-2xl block mb-1.5">{badge.icon}</span>
              <div className="text-xs font-semibold tracking-wide" style={{ color: "var(--text-dim)" }}>
                {badge.name}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)", fontSize: 9 }}>
                {badge.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
