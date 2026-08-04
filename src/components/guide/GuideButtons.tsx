"use client";

import { ReactNode } from "react";
import { WhatsAppButton, primaryButtonClass } from "@/components/buttons";
import { HOME_WORKOUT_PDF_URL } from "@/lib/config";
import { getHomeWorkoutGuideWhatsAppUrl } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

function PdfIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
    </svg>
  );
}

// زر يفتح ملف جدول التمارين المنزلية في تبويب جديد
export function PdfLinkButton({
  children,
  context,
  className = "",
}: {
  children: ReactNode;
  context: string;
  className?: string;
}) {
  return (
    <a
      href={HOME_WORKOUT_PDF_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("home_workout_pdf_click", { context })}
      className={`${primaryButtonClass} flex items-center justify-center gap-2 text-center ${className}`}
    >
      <PdfIcon />
      {children}
    </a>
  );
}

// زر واتساب الدعم - يستخدم نفس رقم ومنطق الواتساب الموجود في المشروع
export function GuideWhatsAppButton({ children }: { children: ReactNode }) {
  return (
    <WhatsAppButton
      href={getHomeWorkoutGuideWhatsAppUrl()}
      onClick={() => trackEvent("whatsapp_click", { context: "home_workout_guide" })}
    >
      {children}
    </WhatsAppButton>
  );
}

// شريط ثابت أسفل الشاشة على الجوال فقط
// الصفحة تترك مسافة سفلية بمقدار ارتفاعه عشان ما يغطي أي محتوى
export function StickyPdfBar() {
  return (
    <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur sm:hidden">
      <div className="mx-auto max-w-[720px] px-5 py-3">
        <PdfLinkButton context="home_workout_guide_sticky">
          فتح جدول التمارين
        </PdfLinkButton>
      </div>
    </div>
  );
}
