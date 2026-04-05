"use client";

import { useState, useCallback } from "react";
import { DEFAULT_SCHEDULE, PROTOCOLS } from "@/lib/protocols";
import { EXERCISES } from "@/lib/exercises";
import { ExerciseSvg } from "@/components/exercises/ExerciseSvg";
import type { WeekSchedule, ProtocolType, WorkoutExerciseLog } from "@/types/workout";
import type { Database } from "@/types/database";

type WorkoutLogRow = Database["public"]["Tables"]["workout_logs"]["Row"];
type ScheduleRow = Database["public"]["Tables"]["user_schedules"]["Row"];

interface TodayViewProps {
  workoutLog: WorkoutLogRow | null;
  scheduleRows: ScheduleRow[];
  userId: string;
}

function buildSchedule(rows: ScheduleRow[]): WeekSchedule {
  if (rows.length === 0) return DEFAULT_SCHEDULE;
  const schedule: WeekSchedule = { ...DEFAULT_SCHEDULE };
  for (const row of rows) {
    schedule[row.day_of_week] = row.protocol as ProtocolType | null;
  }
  return schedule;
}

export function TodayView({ workoutLog, scheduleRows, userId }: TodayViewProps) {
  const schedule = buildSchedule(scheduleRows);
  const today = new Date();
  const dow = today.getDay();
  const todayProtocol = schedule[dow] ?? null;
  const protocol = todayProtocol ? PROTOCOLS[todayProtocol] : null;

  const initialExercises: WorkoutExerciseLog[] =
    (workoutLog?.exercises_json as WorkoutExerciseLog[] | null) ??
    (protocol?.exercises.map((e) => ({ id: e.id, done: false })) ?? []);

  const [exercises, setExercises] = useState<WorkoutExerciseLog[]>(initialExercises);
  const [saving, setSaving] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [restTimer, setRestTimer] = useState<{ active: boolean; seconds: number; total: number }>({
    active: false,
    seconds: 0,
    total: 0,
  });

  const completedCount = exercises.filter((e) => e.done).length;
  const totalCount = exercises.length;
  const allDone = totalCount > 0 && completedCount === totalCount;
  const workoutAlreadyCompleted = workoutLog?.completed ?? false;

  const toggleExercise = useCallback(
    (id: string) => {
      setExercises((prev) =>
        prev.map((e) => (e.id === id ? { ...e, done: !e.done } : e))
      );
    },
    []
  );

  async function handleComplete() {
    if (saving) return;
    setSaving(true);
    try {
      const today = new Date().toISOString().split("T")[0]!;
      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workoutDate: today,
          protocol: todayProtocol,
          completed: true,
          exercises,
        }),
      });
      if (res.ok) {
        setShowCongrats(true);
      }
    } finally {
      setSaving(false);
    }
  }

  async function saveProgress() {
    if (!protocol || saving) return;
    setSaving(true);
    try {
      const today = new Date().toISOString().split("T")[0]!;
      await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workoutDate: today,
          protocol: todayProtocol,
          completed: false,
          exercises,
        }),
      });
    } finally {
      setSaving(false);
    }
  }

  // Rest day
  if (!protocol) {
    return (
      <div className="p-4">
        <div
          className="rounded-2xl p-10 text-center"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div className="text-5xl mb-3">🌿</div>
          <h2 className="font-raleway font-black text-2xl mb-2" style={{ color: "var(--text-dim)" }}>
            Rest Day
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Recovery is part of training.
            <br />
            Stretch, hydrate, and come back strong.
          </p>
        </div>
      </div>
    );
  }

  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="p-4">
      {/* Protocol badge + title */}
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4"
        style={{
          background: "var(--green-xdim)",
          border: "1px solid var(--green-dim)",
          color: "var(--green)",
        }}
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: protocol.color }}
        />
        {protocol.label}
      </div>

      <h1 className="font-raleway font-black text-3xl leading-tight mb-1">
        {protocol.name}
      </h1>
      <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
        {protocol.description}
      </p>

      {/* Progress bar */}
      <div
        className="rounded-full h-1.5 overflow-hidden mb-1"
        style={{ background: "var(--card3)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progressPct}%`,
            background: "linear-gradient(90deg, var(--green), var(--green-bright))",
          }}
        />
      </div>
      <div className="flex justify-between text-xs mb-5" style={{ color: "var(--text-muted)" }}>
        <span>{completedCount} of {totalCount} done</span>
        <span>{Math.round(progressPct)}%</span>
      </div>

      {/* Exercise cards */}
      <div className="space-y-2.5 mb-4">
        {protocol.exercises.map((pe) => {
          const ex = EXERCISES[pe.id];
          if (!ex) return null;
          const log = exercises.find((e) => e.id === pe.id);
          const isDone = log?.done ?? false;

          return (
            <div
              key={pe.id}
              onClick={() => toggleExercise(pe.id)}
              className="rounded-2xl overflow-hidden cursor-pointer transition-all"
              style={{
                background: isDone ? "rgba(0,175,81,0.06)" : "var(--card)",
                border: `1px solid ${isDone ? "var(--green-dim)" : "var(--border)"}`,
              }}
            >
              <div className="flex items-stretch">
                {/* SVG animation */}
                <div
                  className="w-24 flex-shrink-0 flex items-center justify-center"
                  style={{ background: "#111", minHeight: 80 }}
                >
                  <ExerciseSvg exerciseId={pe.id} className="w-full h-full" />
                </div>

                {/* Info */}
                <div className="flex-1 p-3 flex flex-col justify-between">
                  <div>
                    <div className="font-raleway font-bold text-sm mb-1">{ex.name}</div>
                    <div className="flex gap-2 flex-wrap">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "var(--card3)", color: "var(--text-dim)" }}
                      >
                        {pe.sets} sets
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "var(--card3)", color: "var(--text-dim)" }}
                      >
                        {pe.reps}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "var(--card3)", color: "var(--text-muted)" }}
                      >
                        {pe.rest}s rest
                      </span>
                    </div>
                  </div>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    {ex.cue}
                  </p>
                </div>

                {/* Check */}
                <div
                  className="w-11 flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{
                    borderLeft: "1px solid var(--border)",
                    background: isDone ? "var(--green)" : "transparent",
                  }}
                >
                  {isDone ? (
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" style={{ color: "var(--text-muted)" }}>
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save progress */}
      {!workoutAlreadyCompleted && completedCount > 0 && !allDone && (
        <button
          onClick={saveProgress}
          disabled={saving}
          className="w-full py-3 rounded-xl text-sm font-semibold mb-3 transition-opacity disabled:opacity-50"
          style={{
            background: "var(--card2)",
            border: "1px solid var(--border)",
            color: "var(--text-dim)",
          }}
        >
          {saving ? "Saving..." : "Save Progress"}
        </button>
      )}

      {/* Complete button */}
      {!workoutAlreadyCompleted && (
        <button
          onClick={handleComplete}
          disabled={saving || !allDone}
          className="w-full py-4 rounded-2xl font-raleway font-black text-base text-black transition-all disabled:opacity-40"
          style={{
            background: "linear-gradient(135deg, var(--green), var(--green-bright))",
            boxShadow: allDone ? "0 4px 20px rgba(0,175,81,0.3)" : "none",
          }}
        >
          {saving ? "SAVING..." : "COMPLETE WORKOUT"}
        </button>
      )}

      {workoutAlreadyCompleted && (
        <div
          className="w-full py-4 rounded-2xl text-center font-raleway font-black text-base"
          style={{ background: "var(--green-xdim)", border: "1px solid var(--green-dim)", color: "var(--green)" }}
        >
          ✓ WORKOUT COMPLETE
        </div>
      )}

      {/* Congrats overlay */}
      {showCongrats && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center"
          style={{ background: "rgba(0,0,0,0.9)" }}
          onClick={() => setShowCongrats(false)}
        >
          <div className="text-6xl mb-4 animate-bounce-custom">⚡</div>
          <h2 className="font-raleway font-black text-4xl mb-2" style={{ color: "var(--yellow)" }}>
            WORKOUT DONE!
          </h2>
          <p className="text-base mb-8" style={{ color: "var(--text-dim)" }}>
            Keep building your streak
          </p>
          <button
            onClick={() => { setShowCongrats(false); window.location.reload(); }}
            className="px-12 py-4 rounded-2xl font-raleway font-black text-lg text-black"
            style={{
              background: "linear-gradient(135deg, var(--green), var(--green-bright))",
              boxShadow: "0 4px 24px rgba(0,175,81,0.4)",
            }}
          >
            KEEP THE GRIND
          </button>
        </div>
      )}
    </div>
  );
}
