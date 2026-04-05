/**
 * Core streak and stats business logic.
 * Pure functions — no side effects, fully testable.
 */

import type { WeekSchedule } from "@/types/workout";

/** Format a Date as YYYY-MM-DD */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Today's date string */
export function todayStr(): string {
  return formatDate(new Date());
}

/** Parse YYYY-MM-DD into a Date at midnight UTC */
export function parseDate(str: string): Date {
  return new Date(`${str}T00:00:00`);
}

/** Get all scheduled workout dates over the last N days */
export function getScheduledDates(schedule: WeekSchedule, daysBack: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i < daysBack; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dow = d.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    if (schedule[dow] !== null && schedule[dow] !== undefined) {
      dates.push(formatDate(d));
    }
  }
  return dates;
}

/** Current streak: consecutive completed scheduled days ending today */
export function calculateCurrentStreak(
  completedDates: Set<string>,
  schedule: WeekSchedule
): number {
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDate(d);
    const dow = d.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;

    // Skip rest days
    if (schedule[dow] === null || schedule[dow] === undefined) continue;

    if (completedDates.has(dateStr)) {
      streak++;
    } else {
      // Only break streak if this is a past day (not today with no workout yet)
      if (i > 0) break;
    }
  }

  return streak;
}

/** Best streak ever from a set of completed dates and a schedule */
export function calculateBestStreak(
  completedDates: Set<string>,
  schedule: WeekSchedule,
  allDates: string[]
): number {
  let best = 0;
  let current = 0;

  const sorted = [...allDates].sort();

  for (const dateStr of sorted) {
    const d = parseDate(dateStr);
    const dow = d.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    if (schedule[dow] === null || schedule[dow] === undefined) continue;

    if (completedDates.has(dateStr)) {
      current++;
      if (current > best) best = current;
    } else {
      current = 0;
    }
  }

  return best;
}

/** Count workouts in the last 7 days */
export function countWeekWorkouts(completedDates: Set<string>): number {
  const today = new Date();
  let count = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (completedDates.has(formatDate(d))) count++;
  }
  return count;
}

/** Completion rate for the last 30 days (scheduled days only) */
export function monthCompletionRate(
  completedDates: Set<string>,
  schedule: WeekSchedule
): number {
  const scheduledDates = getScheduledDates(schedule, 30);
  if (scheduledDates.length === 0) return 0;
  const completedCount = scheduledDates.filter((d) => completedDates.has(d)).length;
  return Math.round((completedCount / scheduledDates.length) * 100);
}

/** Calendar heat level for a date (0–3 + streak) */
export function heatLevel(
  dateStr: string,
  completedDates: Set<string>,
  streakDates: Set<string>
): 0 | 1 | 2 | 3 | 4 {
  if (!completedDates.has(dateStr)) return 0;
  if (streakDates.has(dateStr)) return 4; // streak highlight
  // Vary level by hash of date for visual interest
  const hash = dateStr.split("-").reduce((a, b) => a + parseInt(b, 10), 0);
  if (hash % 3 === 0) return 3;
  if (hash % 3 === 1) return 2;
  return 1;
}
