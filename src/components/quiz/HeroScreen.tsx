"use client";

import { PlanHeroVisual } from "@/components/workout/PlanHeroVisual";
import { WorkoutPrimaryButton } from "@/components/workout/WorkoutButtons";

export function HeroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="scrollbar-hide flex-1 overflow-y-auto overscroll-contain px-6">
        <div className="flex min-h-full flex-col justify-center py-6">
          <PlanHeroVisual />

          <h1
            style={{ animationDelay: "420ms" }}
            className="animate-ob-rise mt-8 text-balance text-center text-[28px] font-extrabold leading-[1.3] text-white"
          >
            خلينا نختار لك البرنامج الأنسب
          </h1>

          <p
            style={{ animationDelay: "500ms" }}
            className="animate-ob-rise mx-auto mt-3 max-w-[340px] text-balance text-center text-[15px] leading-[1.7] text-ob-text-dim"
          >
            جاوبي على أسئلة بسيطة ونجهز لك خطة تمرين وتغذية مناسبة لهدفك وطريقة
            تمرينك.
          </p>

          <div
            style={{ animationDelay: "580ms" }}
            className="animate-ob-rise mt-7 flex w-full items-center gap-3 rounded-[22px] border border-wk-pink/25 bg-wk-pink-deep px-4 py-4"
          >
            <span
              aria-hidden
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-wk-pink/20 text-wk-pink-text"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-[22px] w-[22px]">
                <path
                  d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <p className="text-[15px] font-bold leading-6 text-white">
              خطة تمرين + تغذية مناسبة لهدفك
            </p>
          </div>
        </div>
      </div>

      <div className="safe-bottom shrink-0 px-6 pb-6 pt-3">
        <WorkoutPrimaryButton
          onClick={onStart}
          className="h-[60px]! rounded-full! text-[18px]! font-extrabold!"
        >
          ابدئي الآن
        </WorkoutPrimaryButton>
        <p className="mt-3 text-center text-[13px] text-ob-text-dim">
          النتيجة تظهر لك مباشرة قبل الدفع
        </p>
      </div>
    </div>
  );
}
