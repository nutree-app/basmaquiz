import { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full justify-center bg-background-soft">
      <div className="relative flex min-h-dvh w-full max-w-[480px] flex-col bg-background sm:my-4 sm:min-h-[calc(100dvh-2rem)] sm:rounded-[2.5rem] sm:border sm:border-border sm:shadow-2xl">
        {children}
      </div>
    </div>
  );
}
