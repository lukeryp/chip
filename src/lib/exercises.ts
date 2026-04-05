import type { Exercise } from "@/types/workout";

export const EXERCISES: Record<string, Exercise> = {
  pushup: {
    id: "pushup",
    name: "Push-Up",
    variants: ["Standard", "Diamond", "Wide", "Clap"],
    cue: "Core tight, chest to floor",
    svgPath: "pushup",
  },
  squat: {
    id: "squat",
    name: "Squat",
    variants: ["Bodyweight", "Jump", "Pistol"],
    cue: "Knees track toes, chest up",
    svgPath: "squat",
  },
  burpee: {
    id: "burpee",
    name: "Burpee",
    variants: ["Standard", "No Jump"],
    cue: "Explosive — max power",
    svgPath: "burpee",
  },
  plank: {
    id: "plank",
    name: "Plank",
    variants: ["Standard", "Side Plank", "Plank to Push-Up"],
    cue: "Straight line head to heels",
    svgPath: "plank",
  },
  boxjump: {
    id: "boxjump",
    name: "Box Jump",
    variants: ["Box Jump", "Tuck Jump"],
    cue: "Land soft — absorb with knees",
    svgPath: "boxjump",
  },
  mountainclimber: {
    id: "mountainclimber",
    name: "Mountain Climber",
    variants: ["Standard", "Cross-Body"],
    cue: "Hips level — drive knees fast",
    svgPath: "mountainclimber",
  },
  lunge: {
    id: "lunge",
    name: "Lunge",
    variants: ["Walking", "Jump", "Reverse"],
    cue: "90° both knees, upright torso",
    svgPath: "lunge",
  },
  broadjump: {
    id: "broadjump",
    name: "Broad Jump",
    variants: ["Standing", "Continuous"],
    cue: "Arm swing — stick the landing",
    svgPath: "broadjump",
  },
  medballslam: {
    id: "medballslam",
    name: "Med Ball Slam",
    variants: ["Standard", "Rotational"],
    cue: "Full extension overhead, slam hard",
    svgPath: "medballslam",
  },
  sprint: {
    id: "sprint",
    name: "Sprint / High Knees",
    variants: ["Sprint", "High Knees", "A-Skip"],
    cue: "Drive arms — knees to 90°",
    svgPath: "sprint",
  },
};
