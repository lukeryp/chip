import { describe, it, expect } from "vitest";
import { PROTOCOLS, BADGES, DEFAULT_SCHEDULE } from "@/lib/protocols";
import { EXERCISES } from "@/lib/exercises";

describe("PROTOCOLS", () => {
  const protocolIds = ["speed", "strength", "power", "recovery"] as const;

  it("defines all 4 protocols", () => {
    expect(Object.keys(PROTOCOLS)).toHaveLength(4);
    protocolIds.forEach((id) => expect(PROTOCOLS[id]).toBeDefined());
  });

  it("each protocol has at least 2 exercises", () => {
    for (const proto of Object.values(PROTOCOLS)) {
      expect(proto.exercises.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("all referenced exercises exist in EXERCISES", () => {
    for (const proto of Object.values(PROTOCOLS)) {
      for (const ex of proto.exercises) {
        expect(EXERCISES[ex.id], `Exercise ${ex.id} not found`).toBeDefined();
      }
    }
  });

  it("each protocol exercise has valid sets and rest time", () => {
    for (const proto of Object.values(PROTOCOLS)) {
      for (const ex of proto.exercises) {
        expect(ex.sets).toBeGreaterThan(0);
        expect(ex.rest).toBeGreaterThanOrEqual(0);
        expect(ex.reps).toBeTruthy();
      }
    }
  });

  it("protocols have required fields", () => {
    for (const proto of Object.values(PROTOCOLS)) {
      expect(proto.id).toBeTruthy();
      expect(proto.name).toBeTruthy();
      expect(proto.label).toBeTruthy();
      expect(proto.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(proto.description).toBeTruthy();
    }
  });
});

describe("DEFAULT_SCHEDULE", () => {
  it("has entries for all 7 days", () => {
    expect(Object.keys(DEFAULT_SCHEDULE)).toHaveLength(7);
    for (let i = 0; i < 7; i++) {
      expect(i in DEFAULT_SCHEDULE).toBe(true);
    }
  });

  it("all values are valid protocol IDs or null", () => {
    const validProtocols = new Set(["speed", "strength", "power", "recovery", null]);
    for (const val of Object.values(DEFAULT_SCHEDULE)) {
      expect(validProtocols.has(val)).toBe(true);
    }
  });

  it("has at least 3 workout days and at least 1 rest day", () => {
    const workoutDays = Object.values(DEFAULT_SCHEDULE).filter(Boolean).length;
    const restDays = Object.values(DEFAULT_SCHEDULE).filter((v) => v === null).length;
    expect(workoutDays).toBeGreaterThanOrEqual(3);
    expect(restDays).toBeGreaterThanOrEqual(1);
  });
});

describe("BADGES", () => {
  it("defines 6 badges", () => {
    expect(BADGES).toHaveLength(6);
  });

  it("each badge has required fields", () => {
    for (const badge of BADGES) {
      expect(badge.id).toBeTruthy();
      expect(badge.icon).toBeTruthy();
      expect(badge.name).toBeTruthy();
      expect(badge.desc).toBeTruthy();
      expect(typeof badge.check).toBe("function");
    }
  });

  it("badge IDs are unique", () => {
    const ids = BADGES.map((b) => b.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("first_spark earns after 1 workout", () => {
    const firstSpark = BADGES.find((b) => b.id === "first");
    expect(firstSpark?.check(0, 0, 0)).toBe(false);
    expect(firstSpark?.check(1, 0, 0)).toBe(true);
  });

  it("week1 badge earns at 7-day streak", () => {
    const week1 = BADGES.find((b) => b.id === "week1");
    expect(week1?.check(10, 6, 5)).toBe(false);
    expect(week1?.check(10, 7, 5)).toBe(true);
  });

  it("iron_week badge earns at 5 workouts this week", () => {
    const ironWeek = BADGES.find((b) => b.id === "strong");
    expect(ironWeek?.check(20, 10, 4)).toBe(false);
    expect(ironWeek?.check(20, 10, 5)).toBe(true);
  });

  it("century badge earns at 100 total workouts", () => {
    const century = BADGES.find((b) => b.id === "total100");
    expect(century?.check(99, 0, 0)).toBe(false);
    expect(century?.check(100, 0, 0)).toBe(true);
  });
});

describe("EXERCISES", () => {
  it("defines 10 exercises", () => {
    expect(Object.keys(EXERCISES)).toHaveLength(10);
  });

  it("each exercise has required fields", () => {
    for (const ex of Object.values(EXERCISES)) {
      expect(ex.id).toBeTruthy();
      expect(ex.name).toBeTruthy();
      expect(ex.variants.length).toBeGreaterThan(0);
      expect(ex.cue).toBeTruthy();
    }
  });

  it("exercise IDs match their keys", () => {
    for (const [key, ex] of Object.entries(EXERCISES)) {
      expect(ex.id).toBe(key);
    }
  });
});
