import type { Protocol, WeekSchedule, Badge } from "@/types/workout";

export const PROTOCOLS: Record<string, Protocol> = {
  speed: {
    id: "speed",
    name: "Speed Day",
    label: "SPEED",
    color: "#f4ee19",
    description: "Explosive power — move fast",
    exercises: [
      { id: "boxjump", sets: 3, reps: "8 reps", rest: 30 },
      { id: "broadjump", sets: 3, reps: "5 reps", rest: 30 },
      { id: "sprint", sets: 4, reps: "20s", rest: 40 },
      { id: "burpee", sets: 3, reps: "8 reps", rest: 45 },
    ],
  },
  strength: {
    id: "strength",
    name: "Strength Day",
    label: "STRENGTH",
    color: "#00af51",
    description: "Foundation — build the base",
    exercises: [
      { id: "pushup", sets: 4, reps: "15 reps", rest: 45 },
      { id: "squat", sets: 4, reps: "20 reps", rest: 45 },
      { id: "lunge", sets: 3, reps: "12 ea.", rest: 45 },
      { id: "plank", sets: 3, reps: "45s", rest: 30 },
    ],
  },
  power: {
    id: "power",
    name: "Power Day",
    label: "POWER",
    color: "#ff6432",
    description: "Max output — golf speed",
    exercises: [
      { id: "medballslam", sets: 3, reps: "10 reps", rest: 60 },
      { id: "squat", sets: 3, reps: "8 jumps", rest: 60 },
      { id: "pushup", sets: 3, reps: "10 clap", rest: 60 },
      { id: "boxjump", sets: 3, reps: "6 reps", rest: 60 },
    ],
  },
  recovery: {
    id: "recovery",
    name: "Active Recovery",
    label: "RECOVERY",
    color: "#6699ff",
    description: "Move easy — restore",
    exercises: [
      { id: "mountainclimber", sets: 2, reps: "20 reps", rest: 20 },
      { id: "lunge", sets: 2, reps: "10 ea.", rest: 20 },
      { id: "plank", sets: 2, reps: "30s", rest: 20 },
    ],
  },
};

export const DEFAULT_SCHEDULE: WeekSchedule = {
  0: null, // Sun - rest
  1: "strength", // Mon
  2: "speed", // Tue
  3: null, // Wed - rest
  4: "power", // Thu
  5: "speed", // Fri
  6: "strength", // Sat
};

export const BADGES: Badge[] = [
  {
    id: "first",
    icon: "⚡",
    name: "First Spark",
    desc: "Complete 1 workout",
    check: (total) => total >= 1,
  },
  {
    id: "week1",
    icon: "🔥",
    name: "7-Day Streak",
    desc: "7 days in a row",
    check: (_, streak) => streak >= 7,
  },
  {
    id: "strong",
    icon: "💪",
    name: "Iron Week",
    desc: "5 workouts in one week",
    check: (_, __, week) => week >= 5,
  },
  {
    id: "month1",
    icon: "🏆",
    name: "30-Day Grind",
    desc: "30-day streak",
    check: (_, streak) => streak >= 30,
  },
  {
    id: "total25",
    icon: "🎯",
    name: "25 Club",
    desc: "25 total workouts",
    check: (total) => total >= 25,
  },
  {
    id: "total100",
    icon: "💯",
    name: "Century",
    desc: "100 total workouts",
    check: (total) => total >= 100,
  },
];
