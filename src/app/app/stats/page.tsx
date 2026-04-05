import { createClient } from "@/lib/supabase/server";
import { StatsView } from "@/components/stats/StatsView";

export default async function StatsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const { data: logs } = await supabase
    .from("workout_logs")
    .select("workout_date, completed, protocol, duration_seconds")
    .eq("user_id", user!.id)
    .gte("workout_date", threeMonthsAgo.toISOString().split("T")[0]!)
    .order("workout_date", { ascending: true });

  const { data: scheduleRows } = await supabase
    .from("user_schedules")
    .select("*")
    .eq("user_id", user!.id);

  return (
    <StatsView
      logs={logs ?? []}
      scheduleRows={scheduleRows ?? []}
    />
  );
}
