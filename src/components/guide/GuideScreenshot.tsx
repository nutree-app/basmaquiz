"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { GuideScreenshot as Screenshot } from "@/lib/home-workout-guide";

function ZoomIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M11 8.5v5M8.5 11h5M16 16l4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function GuideScreenshot({ screenshot }: { screenshot: Screenshot }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // أثناء فتح المعاينة: نوقف تمرير الصفحة خلفها، ونسمح بالإغلاق بزر Escape
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <figure className="mt-5">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`تكبير الصورة: ${screenshot.caption}`}
        className="mx-auto block w-full max-w-[360px] overflow-hidden rounded-3xl border border-border bg-card-soft shadow-lg shadow-black/30 transition-transform active:scale-[0.99]"
      >
        {/* نعرض أعلى اللقطة بمقاس واضح، والصورة كاملة تنفتح في المعاينة */}
        <span className="relative block max-h-[520px] overflow-hidden sm:max-h-[560px]">
          <Image
            src={screenshot.src}
            alt={screenshot.alt}
            width={screenshot.width}
            height={screenshot.height}
            sizes="(max-width: 400px) 100vw, 360px"
            quality={90}
            className="h-auto w-full"
          />
          <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1.5 text-xs font-bold text-white">
            <ZoomIcon size={14} />
            اضغطي لعرض الصورة كاملة
          </span>
        </span>
      </button>

      <figcaption className="mt-3 text-center text-sm leading-6 text-muted">
        {screenshot.caption}
      </figcaption>

      {/* المعاينة تُركّب على <body> مباشرة، لأن أي تحويل transform على عنصر أب
          يخلي العنصر الثابت fixed ينحسب بالنسبة له بدل الشاشة */}
      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={screenshot.caption}
            onClick={close}
            className="animate-fade-in fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/90 p-4 pt-20"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="إغلاق المعاينة"
              className="fixed left-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/25 bg-black/70 text-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <Image
              src={screenshot.src}
              alt={screenshot.alt}
              width={screenshot.width}
              height={screenshot.height}
              sizes="(max-width: 560px) 100vw, 520px"
              quality={90}
              onClick={(event) => event.stopPropagation()}
              className="mx-auto h-auto w-full max-w-[520px] rounded-2xl"
            />

            <p className="mx-auto mt-4 max-w-[520px] pb-8 text-center text-sm leading-6 text-white/80">
              {screenshot.caption}
            </p>
          </div>,
          document.body,
        )}
    </figure>
  );
}
