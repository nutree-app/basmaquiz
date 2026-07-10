"use client";

import { ReactNode } from "react";
import { WhatsAppIcon } from "./buttons";
import { getFloatingWhatsAppUrl } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full justify-center bg-background-soft">
      <div className="relative flex min-h-dvh w-full max-w-[480px] flex-col bg-background sm:my-4 sm:min-h-[calc(100dvh-2rem)] sm:rounded-[2.5rem] sm:border sm:border-border sm:shadow-2xl">
        {children}
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-40">
        <div className="relative mx-auto h-0 w-full max-w-[480px]">
          <a
            href={getFloatingWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="تواصل واتساب"
            onClick={() => trackEvent("whatsapp_click", { context: "floating" })}
            className="pointer-events-auto absolute bottom-0 left-4 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-xl shadow-black/30 transition-transform active:scale-90"
          >
            <WhatsAppIcon size={26} />
          </a>
        </div>
      </div>
    </div>
  );
}
