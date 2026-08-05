"use client";

import type { WorkoutPlan } from "@/lib/workout-plan";

/**
 * The generated week, shown on the result screen above the product card.
 *
 * This is where the two new answers become visible: the header states the
 * location and day count, and the list below has exactly `plan.days` entries
 * built from that location's exercise vocabulary.
 */
export function WorkoutPlanCard({ plan }: { plan: WorkoutPlan }) {
  return (
    <section className="overflow-hidden rounded-[22px] border border-wk-pink/25 bg-ob-card">
      <header className="border-b border-white/[0.07] bg-wk-pink-deep px-5 py-4">
        <p className="text-[12.5px] font-bold text-wk-pink-text">جدولك الأسبوعي</p>
        <h3 className="mt-1 text-[17px] font-extrabold leading-snug text-white">
          {plan.splitName}
        </h3>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-black/25 px-3 py-1 text-[12.5px] font-bold text-white">
            {plan.locationLabel}
          </span>
          <span className="rounded-full bg-black/25 px-3 py-1 text-[12.5px] font-bold text-white">
            {plan.days} أيام تمرين
          </span>
          <span className="rounded-full bg-black/25 px-3 py-1 text-[12.5px] font-bold text-white">
            {plan.intensity}
          </span>
        </div>
      </header>

      <ol className="divide-y divide-white/[0.06]">
        {plan.schedule.map((day, index) => (
          <li
            key={day.day}
            style={{ animationDelay: `${80 + index * 60}ms` }}
            className="animate-ob-rise px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-wk-pink/15 text-[14px] font-extrabold text-wk-pink-text"
              >
                {day.day}
              </span>
              <h4 className="min-w-0 flex-1 text-[15px] font-bold text-white">{day.title}</h4>
            </div>

            <ul className="mt-2.5 flex flex-wrap gap-1.5 ps-12">
              {day.exercises.map((exercise) => (
                <li
                  key={exercise}
                  className="rounded-lg bg-ob-card-alt px-2.5 py-1 text-[12.5px] text-ob-text-dim"
                >
                  {exercise}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <p className="border-t border-white/[0.06] px-5 py-3.5 text-[12.5px] leading-6 text-ob-text-faint">
        {plan.equipmentNote}
      </p>
    </section>
  );
}
