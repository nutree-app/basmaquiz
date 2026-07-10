"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Logo } from "@/components/Logo";
import { WhatsAppButton } from "@/components/buttons";
import { loadLead } from "@/lib/storage";
import { getInvoiceWhatsAppUrl } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { BasmaFitLead } from "@/lib/types";

const SUMMARY_ROWS: { label: string; key: keyof BasmaFitLead }[] = [
  { label: "الهدف", key: "goal" },
  { label: "مكان التمرين", key: "trainingLocation" },
  { label: "المنتج المختار", key: "selectedProductTitle" },
  { label: "السعر", key: "selectedProductPrice" },
];

export default function SuccessPage() {
  const [lead, setLead] = useState<BasmaFitLead | null | undefined>(undefined);
  const loaded = lead !== undefined;

  useEffect(() => {
    const loadedLead = loadLead();
    // localStorage فقط متاح على المتصفح، لذا نقرأ الفاتورة بعد التركيب
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLead(loadedLead);

    if (loadedLead) {
      trackEvent("payment_success", {
        productKey: loadedLead.selectedProductKey,
        productTitle: loadedLead.selectedProductTitle,
      });
    }
  }, []);

  return (
    <AppShell>
      <div className="animate-fade-in flex flex-1 flex-col px-6 pb-10 pt-10">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="mt-10 text-center">
          <h1 className="text-2xl font-black leading-tight text-foreground">
            تم الدفع بنجاح
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted">
            خطتك جاهزة تقريبًا، بس نحتاج نتأكد من الفاتورة عشان نفعّل اشتراكك.
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
            مباشرة على الواتساب، أو تكملين الاختبار من جديد.
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-pink/40 bg-pink/10 p-5 text-center">
          <p className="text-sm font-extrabold text-pink">الخطوة التالية</p>
          <p className="mt-2 text-sm leading-6 text-foreground">
            ارسلي لقطة من الفاتورة على واتساب وبنرسل لك خطوات البدء خلال
            دقائق.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <WhatsAppButton
            href={
              lead
                ? getInvoiceWhatsAppUrl(lead)
                : "https://wa.me/966559964709"
            }
            onClick={() => trackEvent("whatsapp_click", { context: "success" })}
          >
            ارسلي الفاتورة على واتساب
          </WhatsAppButton>

          <Link
            href="/start"
            className="w-full rounded-2xl border border-border bg-transparent px-6 py-4 text-center text-base font-bold text-foreground transition-colors active:scale-[0.98]"
          >
            تعبئة الاختبار من جديد
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
