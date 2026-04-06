import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { NextResponse } from "next/server";
import type { ProtocolType } from "@/types/workout";

const scheduleEntrySchema = z.object({
  day_of_week: z.number().int().min(0).max(6),
  protocol: z.enum(["speed", "strength", "power", "recovery"]).nullable(),
});

const settingsSchema = z.object({
  schedule: z.array(scheduleEntrySchema).max(7),
  notificationsEnabled: z.boolean(),
  displayName: z.string().max(50).nullable(),
});

export async function PUT(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { schedule, notificationsEnabled, displayName } = parsed.data;

  // Upsert schedule rows (delete existing, insert new)
  await supabase.from("user_schedules").delete().eq("user_id", user.id);

  const scheduleRows = schedule
    .filter((s) => s.protocol !== null)
    .map((s) => ({
      user_id: user.id,
      day_of_week: s.day_of_week,
      protocol: s.protocol as ProtocolType,
    }));

  if (scheduleRows.length > 0) {
    const { error: scheduleError } = await supabase
      .from("user_schedules")
      .insert(scheduleRows);

    if (scheduleError) {
      return NextResponse.json({ error: scheduleError.message }, { status: 500 });
    }
  }

  // Upsert user_settings
  const { error: settingsError } = await supabase
    .from("user_settings")
    .upsert(
      { user_id: user.id, notifications_enabled: notificationsEnabled },
      { onConflict: "user_id" }
    );

  if (settingsError) {
    return NextResponse.json({ error: settingsError.message }, { status: 500 });
  }

  // Update profile display name
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ display_name: displayName })
    .eq("id", user.id);

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
