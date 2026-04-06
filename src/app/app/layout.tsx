import { AppShell } from "@/components/layout/AppShell";
import { AppErrorBoundary } from "@/components/layout/AppErrorBoundary";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppErrorBoundary>
      <AppShell>{children}</AppShell>
    </AppErrorBoundary>
  );
}
