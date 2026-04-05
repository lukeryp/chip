import { createClient } from "@/lib/supabase/server";
import { CalendarView } from "@/components/calendar/CalendarView";

export default async function CalendarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch all workout logs for the past year
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const { data: logs } = await supabase
    .from("workout_logs")
    .select("workout_date, completed, protocol")
    .eq("user_id", user!.id)
    .gte("workout_date", oneYearAgo.toISOString().split("T")[0]!)
    .eq("completed", true)
    .order("workout_date", { ascending: true });

  const { data: scheduleRows } = await supabase
    .from("user_schedules")
    .select("*")
    .eq("user_id", user!.id);

  return (
    <CalendarView
      logs={logs ?? []}
      scheduleRows={scheduleRows ?? []}
    />
  );
}
