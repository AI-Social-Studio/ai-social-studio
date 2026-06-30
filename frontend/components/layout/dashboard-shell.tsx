import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { TopHeader } from "./top-header";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex overflow-hidden w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8 pb-12">{children}</div>
        </main>
      </div>
    </div>
  );
}
