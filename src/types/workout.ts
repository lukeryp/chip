export type ProtocolType = "speed" | "strength" | "power" | "recovery";

export interface ExerciseVariant {
  name: string;
}

export interface Exercise {
  id: string;
  name: string;
  variants: string[];
  cue: string;
  svgPath: string; // references a component
}

export interface ProtocolExercise {
  id: string;
  sets: number;
  reps: string;
  rest: number; // seconds
}

export interface Protocol {
  id: ProtocolType;
  name: string;
  label: string;
  color: string;
  description: string;
  exercises: ProtocolExercise[];
}

export interface WorkoutExerciseLog {
  id: string;
  done: boolean;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  workoutDate: string; // YYYY-MM-DD
  protocol: ProtocolType;
  completed: boolean;
  exercises: WorkoutExerciseLog[];
  durationSeconds: number | null;
  notes: string | null;
}

export type WeekSchedule = Record<number, ProtocolType | null>;

export interface Badge {
  id: string;
  icon: string;
  name: string;
  desc: string;
  check: (totalWorkouts: number, currentStreak: number, weekWorkouts: number) => boolean;
}

export interface StreakStats {
  currentStreak: number;
  bestStreak: number;
  totalWorkouts: number;
  weekWorkouts: number;
  monthCompletionRate: number;
}
