import { createClient } from "@/lib/supabase/server";
import { rateLimit, getIp } from "@/lib/rate-limit";
import { z } from "zod";
import { NextResponse } from "next/server";
import type { Database } from "@/types/database";

type WorkoutInsert = Database["public"]["Tables"]["workout_logs"]["Insert"];
type WorkoutUpdate = Database["public"]["Tables"]["workout_logs"]["Update"];

const exerciseLogSchema = z.object({
  id: z.string().min(1),
  done: z.boolean(),
});

const createWorkoutSchema = z.object({
  workoutDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD"),
  protocol: z.enum(["speed", "strength", "power", "recovery"]),
  completed: z.boolean().default(false),
  exercises: z.array(exerciseLogSchema).max(20),
  durationSeconds: z.number().int().min(0).max(86400).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
});

const updateWorkoutSchema = z.object({
  id: z.string().uuid(),
  completed: z.boolean().optional(),
  exercises: z.array(exerciseLogSchema).max(20).optional(),
  durationSeconds: z.number().int().min(0).max(86400).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
});

// GET /api/workouts — list workouts for the authenticated user
export async function GET(request: Request) {
  const rl = rateLimit(getIp(request), { limit: 100, windowSeconds: 60, prefix: "workouts_get" });
  if (!rl.success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  let query = supabase
    .from("workout_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("workout_date", { ascending: false });

  if (from) query = query.gte("workout_date", from);
  if (to) query = query.lte("workout_date", to);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}

// POST /api/workouts — create or upsert a workout log
export async function POST(request: Request) {
  const rl = rateLimit(getIp(request), { limit: 30, windowSeconds: 60, prefix: "workouts_post" });
  if (!rl.success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createWorkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation error", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { workoutDate, protocol, completed, exercises, durationSeconds, notes } = parsed.data;

  const insert: WorkoutInsert = {
    user_id: user.id,
    workout_date: workoutDate,
    protocol,
    completed,
    exercises_json: exercises,
    duration_seconds: durationSeconds ?? null,
    notes: notes ?? null,
  };

  const { data, error } = await supabase
    .from("workout_logs")
    .upsert(insert, { onConflict: "user_id,workout_date" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data }, { status: 201 });
}

// PATCH /api/workouts — update existing workout log
export async function PATCH(request: Request) {
  const rl = rateLimit(getIp(request), { limit: 30, windowSeconds: 60, prefix: "workouts_patch" });
  if (!rl.success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = updateWorkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation error", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { id, completed, exercises, durationSeconds, notes } = parsed.data;

  const updates: WorkoutUpdate = {
    ...(completed !== undefined ? { completed } : {}),
    ...(exercises !== undefined ? { exercises_json: exercises } : {}),
    ...(durationSeconds !== undefined ? { duration_seconds: durationSeconds } : {}),
    ...(notes !== undefined ? { notes } : {}),
  };

  const { data, error } = await supabase
    .from("workout_logs")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}
