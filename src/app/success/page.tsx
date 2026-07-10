"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Logo } from "@/components/Logo";
import { WhatsAppButton } from "@/components/buttons";
import { loadLead } from "@/lib/storage";
import { getSuccessPageWhatsAppUrl } from "@/lib/whatsapp";
import { BasmaFitLead } from "@/lib/types";

const SUMMARY_ROWS: { label: string; key: keyof BasmaFitLead }[] = [
  { label: "الاسم", key: "name" },
  { label: "الخطة المناسبة", key: "recommendedPlan" },
  { label: "الباقة المختارة", key: "selectedPackageTitle" },
  { label: "الايميل", key: "email" },
  { label: "رقم الواتساب", key: "phone" },
];

export default function SuccessPage() {
  const [lead, setLead] = useState<BasmaFitLead | null | undefined>(undefined);
  const loaded = lead !== undefined;

  useEffect(() => {
    // localStorage only exists client-side, so the lead is read once after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLead(loadLead());
  }, []);

  return (
    <AppShell>
      <div className="animate-fade-in flex flex-1 flex-col px-6 pb-10 pt-10">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="mt-10 text-center">
          <h1 className="text-2xl font-black leading-tight text-foreground">
            تم الدفع بنجاح؟
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted">
            ارسلي الفاتورة على الواتساب عشان نفعّل تسجيلك ونرسل لك الخطوات
            التالية.
          </p>
        </div>

        {loaded && lead && (
          <div className="mt-8 flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border">
            {SUMMARY_ROWS.map((row) => (
              <div
                key={row.key}
                className="flex items-center justify-between bg-card px-4 py-3 text-sm"
              >
                <span className="text-muted">{row.label}</span>
                <span className="font-bold text-foreground">
                  {lead[row.key] || "—"}
                </span>
              </div>
            ))}
          </div>
        )}

        {loaded && !lead && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-5 text-center text-sm leading-6 text-muted">
            ما لقينا بيانات محفوظة على هذا الجهاز. تقدرين ترسلين الفاتورة
            مباشرة على الواتساب، أو تعبين الاستمارة من جديد.
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <WhatsAppButton
            href={
              lead
                ? getSuccessPageWhatsAppUrl(lead)
                : "https://wa.me/966559964709"
            }
          >
            ارسلي الفاتورة على واتساب
          </WhatsAppButton>

          <Link
            href="/start"
            className="w-full rounded-2xl border border-border bg-transparent px-6 py-4 text-center text-base font-bold text-foreground transition-colors active:scale-[0.98]"
          >
            تعبئة الاستمارة من جديد
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
