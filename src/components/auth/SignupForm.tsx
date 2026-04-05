"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  displayName: z.string().min(2, "Name must be at least 2 characters").max(50),
});

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const result = signupSchema.safeParse({ email, password, displayName });
    if (!result.success) {
      setError(result.error.errors[0]?.message ?? "Validation error");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signUp({
        email: result.data.email,
        password: result.data.password,
        options: {
          data: { display_name: result.data.displayName },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/app`,
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      setSuccess(true);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">📬</div>
        <h2 className="font-raleway font-black text-xl mb-2" style={{ color: "var(--green)" }}>
          Check Your Email
        </h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          We sent a confirmation link to{" "}
          <span style={{ color: "var(--text)" }}>{email}</span>.
          Click it to start training.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ background: "rgba(255,50,50,0.1)", border: "1px solid rgba(255,50,50,0.3)", color: "#ff6b6b" }}
        >
          {error}
        </div>
      )}

      {(["displayName", "email", "password"] as const).map((field) => (
        <div key={field}>
          <label
            className="block text-xs font-semibold mb-2 uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            {field === "displayName" ? "Your Name" : field === "email" ? "Email" : "Password"}
          </label>
          <input
            type={field === "password" ? "password" : field === "email" ? "email" : "text"}
            value={field === "displayName" ? displayName : field === "email" ? email : password}
            onChange={(e) => {
              if (field === "displayName") setDisplayName(e.target.value);
              else if (field === "email") setEmail(e.target.value);
              else setPassword(e.target.value);
            }}
            placeholder={
              field === "displayName"
                ? "Tiger Woods"
                : field === "email"
                ? "you@example.com"
                : "Min 8 chars, 1 uppercase, 1 number"
            }
            required
            autoComplete={field === "password" ? "new-password" : field === "email" ? "email" : "name"}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
            style={{
              background: "var(--card2)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--green)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-2xl font-raleway font-black text-base text-black transition-opacity disabled:opacity-50"
        style={{
          background: "linear-gradient(135deg, var(--green), var(--green-bright))",
          boxShadow: "0 4px 20px rgba(0,175,81,0.3)",
        }}
      >
        {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
      </button>
    </form>
  );
}
