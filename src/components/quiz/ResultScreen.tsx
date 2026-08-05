"use client";

import { ProductCard } from "@/components/ProductCard";
import { WhatsAppButton } from "@/components/buttons";
import { WorkoutPlanCard } from "@/components/workout/WorkoutPlanCard";
import { PRODUCTS } from "@/lib/products";
import {
  buildResultExplanation,
  buildResultTitle,
  getRecommendedProduct,
} from "@/lib/recommendation";
import { buildWorkoutPlan } from "@/lib/workout-plan";
import { ProductKey, QuizAnswers } from "@/lib/types";
import { getResultWhatsAppUrl } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

export function ResultScreen({
  answers,
  onSelectProduct,
}: {
  answers: QuizAnswers;
  onSelectProduct: (key: ProductKey) => void;
}) {
  const title = buildResultTitle();
  const explanation = buildResultExplanation(answers);
  const recommended = getRecommendedProduct(answers);
  const plan = buildWorkoutPlan(answers);

  return (
    <div className="scrollbar-hide flex-1 overflow-y-auto overscroll-contain">
      <div className="animate-ob-enter px-6 pb-10 pt-8">
        <div className="text-center">
          <h2 className="text-balance text-[26px] font-extrabold leading-tight text-white">
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-[340px] text-[14.5px] leading-7 text-ob-text-dim">
            {explanation}
          </p>
        </div>

        {/* The generated week — driven by the training location and day count. */}
        {plan && (
          <div className="mt-7">
            <WorkoutPlanCard plan={plan} />
          </div>
        )}

        <div className="mt-7">
          <ProductCard
            product={PRODUCTS[recommended]}
            onSelect={() => onSelectProduct(recommended)}
          />
        </div>

        <div className="mt-7 rounded-[22px] border border-white/[0.07] bg-ob-card p-6 text-center">
          <h4 className="text-[17px] font-extrabold text-white">
            تحتاجين مساعدة في اختيار البرنامج؟
          </h4>
          <p className="mt-2 text-[14px] leading-6 text-ob-text-dim">
            تواصلي معنا عبر الواتساب وبنساعدك تختارين الأنسب لك.
          </p>
          <div className="mt-5">
            <WhatsAppButton
              href={getResultWhatsAppUrl(answers)}
              onClick={() => trackEvent("whatsapp_click", { context: "result" })}
            >
              تواصل واتساب
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </div>
  );
}
