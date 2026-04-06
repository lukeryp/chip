import { createClient } from "@/lib/supabase/server";
import { TodayView } from "@/components/today/TodayView";

export default async function AppPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch today's workout log
  const today = new Date().toISOString().split("T")[0]!;
  const { data: workoutLog } = await supabase
    .from("workout_logs")
    .select("*")
    .eq("user_id", user!.id)
    .eq("workout_date", today)
    .maybeSingle();

  // Fetch user schedule
  const { data: scheduleRows } = await supabase
    .from("user_schedules")
    .select("*")
    .eq("user_id", user!.id);

  return (
    <TodayView
      workoutLog={workoutLog}
      scheduleRows={scheduleRows ?? []}
      userId={user!.id}
    />
  );
}
