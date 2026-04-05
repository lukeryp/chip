import { describe, it, expect } from "vitest";
import {
  formatDate,
  parseDate,
  calculateCurrentStreak,
  calculateBestStreak,
  countWeekWorkouts,
  monthCompletionRate,
  getScheduledDates,
} from "@/lib/streak";
import type { WeekSchedule } from "@/types/workout";

const DAILY_SCHEDULE: WeekSchedule = {
  0: "recovery",
  1: "strength",
  2: "speed",
  3: "strength",
  4: "power",
  5: "speed",
  6: "strength",
};

const MON_WED_FRI: WeekSchedule = {
  0: null,
  1: "strength",
  2: null,
  3: "strength",
  4: null,
  5: "speed",
  6: null,
};

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return formatDate(d);
}

describe("formatDate", () => {
  it("formats a date as YYYY-MM-DD", () => {
    const d = new Date(2026, 3, 6); // April 6, 2026
    expect(formatDate(d)).toBe("2026-04-06");
  });

  it("pads month and day with leading zeros", () => {
    const d = new Date(2026, 0, 1); // Jan 1, 2026
    expect(formatDate(d)).toBe("2026-01-01");
  });
});

describe("parseDate", () => {
  it("parses YYYY-MM-DD back to a date", () => {
    const d = parseDate("2026-04-06");
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(3); // April = 3
    expect(d.getDate()).toBe(6);
  });
});

describe("calculateCurrentStreak", () => {
  it("returns 0 when no workouts completed", () => {
    const completed = new Set<string>();
    expect(calculateCurrentStreak(completed, DAILY_SCHEDULE)).toBe(0);
  });

  it("counts consecutive days ending today", () => {
    // Complete workouts for yesterday and the day before (all scheduled)
    const completed = new Set([daysAgo(2), daysAgo(1)]);
    const streak = calculateCurrentStreak(completed, DAILY_SCHEDULE);
    // At minimum 2 (could be more depending on rest days)
    expect(streak).toBeGreaterThanOrEqual(2);
  });

  it("breaks streak on missed scheduled day", () => {
    // Miss 3 days ago, have 2 days before that
    const completed = new Set([daysAgo(5), daysAgo(4)]);
    // Recent days (0, 1, 2, 3) are missed — streak should be 0
    const streak = calculateCurrentStreak(completed, DAILY_SCHEDULE);
    expect(streak).toBe(0);
  });

  it("skips rest days in streak calculation", () => {
    // With MON_WED_FRI schedule, rest days should not break streak
    const today = new Date();
    const todayDow = today.getDay();

    // Find the last 2 scheduled days
    const scheduledDays: string[] = [];
    for (let i = 0; i < 14 && scheduledDays.length < 3; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dow = d.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
      if (MON_WED_FRI[dow] !== null) {
        scheduledDays.push(formatDate(d));
      }
    }

    if (scheduledDays.length >= 2) {
      const completed = new Set(scheduledDays.slice(0, 2));
      const streak = calculateCurrentStreak(completed, MON_WED_FRI);
      expect(streak).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("calculateBestStreak", () => {
  it("returns 0 for empty completion set", () => {
    expect(calculateBestStreak(new Set(), DAILY_SCHEDULE, [])).toBe(0);
  });

  it("finds the longest run", () => {
    // 5 days ago through 3 days ago (3 days), then gap, then 1 day ago
    const completed = new Set([daysAgo(5), daysAgo(4), daysAgo(3), daysAgo(1)]);
    const allDates = [daysAgo(5), daysAgo(4), daysAgo(3), daysAgo(1)];
    const best = calculateBestStreak(completed, DAILY_SCHEDULE, allDates);
    expect(best).toBeGreaterThanOrEqual(1);
  });

  it("best streak >= current streak always", () => {
    const completed = new Set([daysAgo(2), daysAgo(1)]);
    const allDates = [daysAgo(2), daysAgo(1)];
    const current = calculateCurrentStreak(completed, DAILY_SCHEDULE);
    const best = calculateBestStreak(completed, DAILY_SCHEDULE, allDates);
    expect(best).toBeGreaterThanOrEqual(current);
  });
});

describe("countWeekWorkouts", () => {
  it("returns 0 for empty set", () => {
    expect(countWeekWorkouts(new Set())).toBe(0);
  });

  it("counts only last 7 days", () => {
    const completed = new Set([
      daysAgo(0),
      daysAgo(1),
      daysAgo(6),
      daysAgo(8), // older than 7 days — should NOT count
    ]);
    expect(countWeekWorkouts(completed)).toBe(3);
  });

  it("maxes at 7", () => {
    const completed = new Set(
      Array.from({ length: 7 }, (_, i) => daysAgo(i))
    );
    expect(countWeekWorkouts(completed)).toBe(7);
  });
});

describe("monthCompletionRate", () => {
  it("returns 0 with no completions", () => {
    expect(monthCompletionRate(new Set(), DAILY_SCHEDULE)).toBe(0);
  });

  it("returns 100 when all scheduled days completed", () => {
    // Get all scheduled dates in the last 30 days and mark them complete
    const scheduled = getScheduledDates(DAILY_SCHEDULE, 30);
    const completed = new Set(scheduled);
    expect(monthCompletionRate(completed, DAILY_SCHEDULE)).toBe(100);
  });

  it("returns 0 with rest-only schedule", () => {
    const restSchedule: WeekSchedule = {
      0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null,
    };
    expect(monthCompletionRate(new Set([daysAgo(1)]), restSchedule)).toBe(0);
  });

  it("returns value between 0 and 100", () => {
    const completed = new Set([daysAgo(1), daysAgo(3)]);
    const rate = monthCompletionRate(completed, DAILY_SCHEDULE);
    expect(rate).toBeGreaterThanOrEqual(0);
    expect(rate).toBeLessThanOrEqual(100);
  });
});

describe("getScheduledDates", () => {
  it("returns only days with a non-null protocol", () => {
    const scheduled = getScheduledDates(MON_WED_FRI, 14);
    // All returned dates should have a non-null protocol
    for (const dateStr of scheduled) {
      const d = new Date(dateStr + "T00:00:00");
      const dow = d.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
      expect(MON_WED_FRI[dow]).not.toBeNull();
    }
  });

  it("returns at most daysBack dates", () => {
    const scheduled = getScheduledDates(DAILY_SCHEDULE, 30);
    expect(scheduled.length).toBeLessThanOrEqual(30);
    expect(scheduled.length).toBeGreaterThan(0);
  });
});
