import { createClient } from "@/lib/supabase/server";
import { rateLimit, getIp } from "@/lib/rate-limit";
import { z } from "zod";
import { NextResponse } from "next/server";
import type { Database } from "@/types/database";

type ScheduleInsert = Database["public"]["Tables"]["user_schedules"]["Insert"];
type SettingsInsert = Database["public"]["Tables"]["user_settings"]["Insert"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

const updateSettingsSchema = z.object({
  schedule: z
    .record(
      z.string().regex(/^[0-6]$/),
      z.enum(["speed", "strength", "power", "recovery"]).nullable()
    )
    .optional(),
  notificationsEnabled: z.boolean().optional(),
  displayName: z.string().max(50).nullable().optional(),
});

export async function GET(request: Request) {
  const rl = rateLimit(getIp(request), { limit: 60, windowSeconds: 60, prefix: "settings_get" });
  if (!rl.success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [{ data: schedule }, { data: settings }, { data: profile }] = await Promise.all([
    supabase.from("user_schedules").select("*").eq("user_id", user.id),
    supabase.from("user_settings").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("profiles").select("display_name, email").eq("id", user.id).maybeSingle(),
  ]);

  return NextResponse.json({ schedule, settings, profile });
}

export async function PUT(request: Request) {
  const rl = rateLimit(getIp(request), { limit: 20, windowSeconds: 60, prefix: "settings_put" });
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

  const parsed = updateSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation error", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { schedule, notificationsEnabled, displayName } = parsed.data;
  const errors: string[] = [];

  // Update schedule
  if (schedule) {
    const upserts: ScheduleInsert[] = Object.entries(schedule).map(([dow, proto]) => ({
      user_id: user.id,
      day_of_week: parseInt(dow, 10),
      protocol: proto ?? null,
    }));

    const { error } = await supabase
      .from("user_schedules")
      .upsert(upserts, { onConflict: "user_id,day_of_week" });
    if (error) errors.push(`schedule: ${error.message}`);
  }

  // Update settings
  if (notificationsEnabled !== undefined) {
    const settingsUpsert: SettingsInsert = {
      user_id: user.id,
      notifications_enabled: notificationsEnabled,
    };
    const { error } = await supabase
      .from("user_settings")
      .upsert(settingsUpsert, { onConflict: "user_id" });
    if (error) errors.push(`settings: ${error.message}`);
  }

  // Update profile
  if (displayName !== undefined) {
    const profileUpdate: ProfileUpdate = { display_name: displayName };
    const { error } = await supabase
      .from("profiles")
      .update(profileUpdate)
      .eq("id", user.id);
    if (error) errors.push(`profile: ${error.message}`);
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join("; ") }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
