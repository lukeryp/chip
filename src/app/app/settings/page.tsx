import { createClient } from "@/lib/supabase/server";
import { SettingsView } from "@/components/settings/SettingsView";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: scheduleRows }, { data: settings }, { data: profile }] =
    await Promise.all([
      supabase.from("user_schedules").select("*").eq("user_id", user!.id),
      supabase.from("user_settings").select("*").eq("user_id", user!.id).maybeSingle(),
      supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle(),
    ]);

  return (
    <SettingsView
      scheduleRows={scheduleRows ?? []}
      settings={settings}
      profile={profile}
      userId={user!.id}
      userEmail={user!.email ?? ""}
    />
  );
}
