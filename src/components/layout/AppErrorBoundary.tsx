"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("AppErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          className="flex flex-col items-center justify-center min-h-screen text-center px-6"
          style={{ background: "var(--black)" }}
        >
          <div className="text-4xl mb-4">⚡</div>
          <h2
            className="font-raleway font-black text-xl mb-2"
            style={{ color: "var(--yellow)" }}
          >
            Something crashed
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            {this.state.error?.message ?? "Unexpected error"}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-8 py-3 rounded-xl font-raleway font-black text-black text-sm"
            style={{ background: "linear-gradient(135deg, var(--green), var(--green-bright))" }}
          >
            RELOAD
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
