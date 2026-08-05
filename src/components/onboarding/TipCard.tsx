"use client";

/** The green hint panel that closes the activity and motivation screens. */
export default function TipCard({ children }: { children: string }) {
  return (
    <div className="animate-ob-rise mt-5 flex items-start gap-2.5 rounded-2xl bg-ob-green-deep px-4 py-3.5">
      <span aria-hidden className="mt-px text-[15px] leading-none">
        💡
      </span>
      <p className="flex-1 text-[13.5px] font-semibold leading-[1.7] text-ob-green-text">
        {children}
      </p>
    </div>
  );
}
