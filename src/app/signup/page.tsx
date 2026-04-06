import { SignupForm } from "@/components/auth/SignupForm";
import Link from "next/link";
import { Suspense } from "react";

export default function SignupPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "var(--black)", maxWidth: 430, margin: "0 auto" }}
    >
      <div className="w-full">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/">
            <div
              className="font-raleway font-black text-4xl tracking-widest"
              style={{ color: "var(--green)" }}
            >
              CH<span style={{ color: "var(--yellow)" }}>I</span>P
            </div>
          </Link>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            Create your account — it&apos;s free
          </p>
        </div>

        <Suspense>
          <SignupForm />
        </Suspense>

        <p className="mt-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold"
            style={{ color: "var(--green)" }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
