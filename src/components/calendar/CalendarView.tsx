"use client";

import { useMemo } from "react";
import {
  calculateCurrentStreak,
  calculateBestStreak,
  countWeekWorkouts,
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
}

interface CalendarViewProps {
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

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function getCellColor(level: number): string {
  switch (level) {
    case 1: return "#033a1c";
    case 2: return "#006b2f";
    case 3: return "#00af51";
    case 4: return "#f4ee19"; // streak
    default: return "var(--card3)";
  }
}

export function CalendarView({ logs, scheduleRows }: CalendarViewProps) {
  const schedule = buildSchedule(scheduleRows);

  const { completedSet, streakSet, allDates } = useMemo(() => {
    const completed = new Set(logs.filter((l) => l.completed).map((l) => l.workout_date));
    const all = logs.map((l) => l.workout_date);

    // Build streak set (consecutive completed days)
    const streakSet = new Set<string>();
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const ds = formatDate(d);
      const dow = d.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
      if (schedule[dow] === null || schedule[dow] === undefined) continue;
      if (completed.has(ds)) {
        streak++;
        streakSet.add(ds);
      } else if (i > 0) {
        break;
      }
    }

    return { completedSet: completed, streakSet, allDates: all };
  }, [logs, schedule]);

  const currentStreak = useMemo(() => calculateCurrentStreak(completedSet, schedule), [completedSet, schedule]);
  const bestStreak = useMemo(() => calculateBestStreak(completedSet, schedule, allDates), [completedSet, schedule, allDates]);
  const weekCount = useMemo(() => countWeekWorkouts(completedSet), [completedSet]);
  const totalWorkouts = completedSet.size;

  // Build 52-week grid
  const { weeks, monthPositions } = useMemo(() => {
    const today = new Date();
    const cells: Array<{ date: string; level: number; future: boolean }> = [];
    const startDay = new Date(today);
    startDay.setDate(today.getDate() - 364);

    // Align to Sunday
    const offset = startDay.getDay();
    startDay.setDate(startDay.getDate() - offset);

    const todayStr = formatDate(today);

    for (let i = 0; i < 53 * 7; i++) {
      const d = new Date(startDay);
      d.setDate(startDay.getDate() + i);
      const ds = formatDate(d);
      const isFuture = ds > todayStr;

      let level = 0;
      if (!isFuture && completedSet.has(ds)) {
        level = streakSet.has(ds) ? 4 : (completedSet.has(ds) ? 3 : 0);
        // Vary non-streak levels
        if (level === 3) {
          const hash = ds.split("-").reduce((a, b) => a + parseInt(b, 10), 0);
          level = hash % 3 === 0 ? 3 : hash % 3 === 1 ? 2 : 1;
          if (streakSet.has(ds)) level = 4;
        }
      }

      cells.push({ date: ds, level, future: isFuture });
    }

    // Group into weeks
    const weeks: Array<typeof cells> = [];
    for (let w = 0; w < 53; w++) {
      weeks.push(cells.slice(w * 7, w * 7 + 7));
    }

    // Month label positions
    const monthPos: Array<{ label: string; col: number }> = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const firstCell = week[0];
      if (!firstCell) return;
      const d = new Date(firstCell.date + "T00:00:00");
      const m = d.getMonth();
      if (m !== lastMonth) {
        monthPos.push({ label: MONTH_LABELS[m] ?? "", col: wi });
        lastMonth = m;
      }
    });

    return { weeks, monthPositions: monthPos };
  }, [completedSet, streakSet]);

  return (
    <div className="p-4">
      {/* Streak cards */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {[
          { val: currentStreak, lbl: "STREAK", gold: false },
          { val: bestStreak, lbl: "BEST", gold: true },
          { val: totalWorkouts, lbl: "TOTAL", gold: false },
        ].map(({ val, lbl, gold }) => (
          <div
            key={lbl}
            className="rounded-2xl p-3.5 text-center"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div
              className="font-raleway font-black text-2xl leading-none mb-1"
              style={{ color: gold ? "var(--yellow)" : "var(--green)" }}
            >
              {val}
            </div>
            <div className="text-xs font-semibold tracking-widest" style={{ color: "var(--text-muted)" }}>
              {lbl}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
        Grit Calendar
      </div>
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--card)", border: "1px solid var(--border)", padding: "12px 8px" }}
      >
        <div className="overflow-x-auto pb-2">
          <div style={{ minWidth: 53 * 14 + 20 }}>
            {/* Month labels */}
            <div className="flex mb-1" style={{ paddingLeft: 18 }}>
              {monthPositions.map(({ label, col }) => (
                <div
                  key={`${label}-${col}`}
                  className="text-xs uppercase tracking-wide flex-shrink-0"
                  style={{
                    color: "var(--text-muted)",
                    width: 14,
                    marginLeft: col === monthPositions[0]?.col ? 0 : (col - (monthPositions[monthPositions.findIndex(m => m.label === label) - 1]?.col ?? 0) - 1) * 14,
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex">
              {/* Day labels */}
              <div className="flex flex-col gap-0.5 mr-1" style={{ paddingTop: 0 }}>
                {DAY_LABELS.map((d, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 text-right"
                    style={{ fontSize: 8, color: "var(--text-muted)", height: 12, lineHeight: "12px", width: 14 }}
                  >
                    {i % 2 === 1 ? d : ""}
                  </div>
                ))}
              </div>

              {/* Weeks */}
              <div className="flex gap-0.5">
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-0.5">
                    {week.map((cell, di) => (
                      <div
                        key={di}
                        title={cell.date}
                        className="rounded-sm flex-shrink-0"
                        style={{
                          width: 12,
                          height: 12,
                          background: getCellColor(cell.level),
                          opacity: cell.future ? 0.2 : 1,
                          outline: cell.date === formatDate(new Date()) ? "2px solid var(--green)" : "none",
                          outlineOffset: 1,
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly summary */}
      <div className="flex gap-2.5 mt-4">
        {[
          { val: `${weekCount}/7`, lbl: "This Week" },
          { val: `${Math.round((totalWorkouts / Math.max(allDates.length, 1)) * 100)}%`, lbl: "Completion" },
        ].map(({ val, lbl }) => (
          <div
            key={lbl}
            className="flex-1 rounded-xl p-3 text-center"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div className="font-raleway font-bold text-xl" style={{ color: "var(--green)" }}>
              {val}
            </div>
            <div className="text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
              {lbl}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
