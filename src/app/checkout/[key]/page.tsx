"use client";

import { Suspense, use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { Logo } from "@/components/Logo";
import { PrimaryButton, WhatsAppButton } from "@/components/buttons";
import { PRICING_PACKAGES } from "@/lib/packages";
import { SALLA_CHECKOUT_LINKS } from "@/lib/config";
import { BasmaFitLead, PackageKey } from "@/lib/types";
import { loadLead } from "@/lib/storage";
import { getSupportWhatsAppUrl } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

const SUMMARY_ROWS: { label: string; key: keyof BasmaFitLead }[] = [
  { label: "الهدف", key: "goal" },
  { label: "مكان التمرين", key: "trainingLocation" },
  { label: "المستوى", key: "level" },
  { label: "عدد أيام التمرين", key: "trainingDays" },
];

function isValidPackageKey(value: string): value is PackageKey {
  return PRICING_PACKAGES.some((p) => p.key === value);
}

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <CheckoutContent paramsPromise={params} />
    </Suspense>
  );
}

function CheckoutContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ key: string }>;
}) {
  const { key } = use(paramsPromise);
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  const [lead, setLead] = useState<BasmaFitLead | null | undefined>(undefined);
  const [linkNotice, setLinkNotice] = useState(false);

  const pkg = useMemo(
    () => (isValidPackageKey(key) ? PRICING_PACKAGES.find((p) => p.key === key) : undefined),
    [key]
  );

  useEffect(() => {
    // localStorage فقط متاح على المتصفح، لذا نقرأ الفاتورة بعد التركيب
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLead(loadLead());
  }, []);

  useEffect(() => {
    if (!pkg) return;
    trackEvent("checkout_opened", { packageKey: pkg.key, packageTitle: pkg.title });

    if (status === "failed") {
      trackEvent("payment_failed", { packageKey: pkg.key, packageTitle: pkg.title });
    } else if (status === "cancelled") {
      trackEvent("payment_cancelled", { packageKey: pkg.key, packageTitle: pkg.title });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pkg?.key, status]);

  if (!pkg) {
    return (
      <AppShell>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-lg font-bold text-foreground">هذه الباقة غير موجودة</p>
          <Link
            href="/start"
            className="rounded-2xl bg-yellow px-6 py-3 font-extrabold text-yellow-text"
          >
            رجوع للاختبار
          </Link>
        </div>
      </AppShell>
    );
  }

  function handlePay() {
    if (!pkg) return;
    trackEvent("payment_button_click", { packageKey: pkg.key, packageTitle: pkg.title });

    const checkoutUrl = SALLA_CHECKOUT_LINKS[pkg.key];
    if (!checkoutUrl || checkoutUrl.startsWith("PUT_SALLA_INSTANT_CHECKOUT")) {
      setLinkNotice(true);
      window.setTimeout(() => setLinkNotice(false), 3500);
      return;
    }

    window.location.href = checkoutUrl;
  }

  const showIncomplete = status === "failed" || status === "cancelled";

  return (
    <AppShell>
      <div className="animate-fade-in flex flex-1 flex-col px-6 pb-10 pt-8">
        <div className="flex justify-center">
          <Logo size="sm" />
        </div>

        {showIncomplete && (
          <div className="mt-6 rounded-2xl border border-yellow/40 bg-yellow/10 p-4 text-center">
            <p className="text-sm font-bold text-yellow">
              {status === "cancelled" ? "تم إلغاء عملية الدفع" : "لم تكتمل عملية الدفع"}
            </p>
          </div>
        )}

        <div className="mt-6 rounded-3xl border border-border bg-card p-6">
          <p className="text-center text-sm font-bold text-pink">فاتورتك</p>
          <h1 className="mt-2 text-center text-2xl font-black text-foreground">
            {pkg.title}
          </h1>
          <p className="mt-2 text-center text-3xl font-black text-yellow">
            {pkg.price}
          </p>
          <p className="mt-1 text-center text-sm font-bold text-muted">
            {pkg.duration}
          </p>

          {lead && (
            <div className="mt-6 flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border">
              {SUMMARY_ROWS.map((row) => (
                <div
                  key={row.key}
                  className="flex items-center justify-between bg-card-soft px-4 py-3 text-sm"
                >
                  <span className="text-muted">{row.label}</span>
                  <span className="font-bold text-foreground">
                    {lead[row.key] || "—"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8">
          <PrimaryButton onClick={handlePay}>ادفعي الآن</PrimaryButton>
        </div>

        {linkNotice && (
          <p className="mt-3 text-center text-sm font-bold text-yellow animate-fade-in">
            رابط الدفع لهذه الباقة لم يُضاف بعد
          </p>
        )}

        <div className="mt-8 rounded-3xl border border-border bg-card p-6 text-center">
          <h4 className="text-lg font-extrabold text-foreground">
            تحتاجين مساعدة في إكمال الاشتراك؟
          </h4>
          <p className="mt-2 text-sm leading-6 text-muted">
            تواصلي معنا عبر الواتساب
          </p>
          <div className="mt-5">
            <WhatsAppButton
              href={getSupportWhatsAppUrl(lead ?? null)}
              onClick={() =>
                trackEvent("whatsapp_click", { context: "checkout", packageKey: pkg.key })
              }
            >
              تواصل واتساب
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
