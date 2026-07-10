"use client";

import { useState } from "react";

export function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const [imgFailed, setImgFailed] = useState(false);
  const isSmall = size === "sm";

  if (!imgFailed) {
    return (
      // شعار بسمة فت الرسمي - يوضع في public/logo.png
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/logo.png"
        alt="بسمة فت"
        onError={() => setImgFailed(true)}
        className={isSmall ? "h-9 w-auto object-contain" : "h-14 w-auto object-contain"}
      />
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`flex items-center justify-center rounded-full border-2 border-pink ${
          isSmall ? "h-9 w-9" : "h-11 w-11"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={isSmall ? "h-4.5 w-4.5" : "h-5.5 w-5.5"}
        >
          <circle cx="12" cy="5" r="2" fill="#D64B78" />
          <path
            d="M12 7.5c-1.2 0-2.3.6-3 1.6L6.5 12l1.2 1 2.1-2.6c.2-.2.4-.3.7-.3v3.6L7.8 17l1.1 1.2 3.1-3.1 3.1 3.1 1.1-1.2-2.7-3.3v-3.6c.3 0 .5.1.7.3l2.1 2.6 1.2-1-2.5-2.9c-.7-1-1.8-1.6-3-1.6Z"
            fill="#D64B78"
          />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span
          className={`font-extrabold tracking-tight text-foreground ${
            isSmall ? "text-base" : "text-lg"
          }`}
        >
          بسمة فت
        </span>
        <span className="text-[10px] tracking-widest text-muted uppercase">
          Basma Fit
        </span>
      </div>
    </div>
  );
}
