"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Root error boundary:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-black text-text font-work-sans min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <div className="text-4xl mb-4">⚡</div>
          <h1
            className="font-raleway font-black text-2xl mb-2"
            style={{ color: "var(--yellow)" }}
          >
            Something went wrong
          </h1>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            {error.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={reset}
            className="px-8 py-3 rounded-xl font-raleway font-black text-black text-sm"
            style={{ background: "linear-gradient(135deg, var(--green), var(--green-bright))" }}
          >
            TRY AGAIN
          </button>
        </div>
      </body>
    </html>
  );
}
