"use client";

import { useMemo, useState } from "react";
import { HeroScreen } from "./HeroScreen";
import { QuestionScreen } from "./QuestionScreen";
import { LoadingScreen } from "./LoadingScreen";
import { ResultScreen } from "./ResultScreen";
import { getVisibleSteps } from "@/lib/quiz-steps";
import { getRecommendedPlan } from "@/lib/recommendation";
import { EMPTY_ANSWERS, PackageKey, QuizAnswers, RecommendedPlan } from "@/lib/types";
import { buildLead, saveLead, saveQuizAnswers } from "@/lib/storage";
import { PRICING_PACKAGES } from "@/lib/packages";
import { SALLA_CHECKOUT_LINKS } from "@/lib/config";
import { getQuizCompletionWhatsAppUrl } from "@/lib/whatsapp";

type Screen = "hero" | "quiz" | "loading" | "result";

export function QuizFunnel() {
  const [screen, setScreen] = useState<Screen>("hero");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(EMPTY_ANSWERS);
  const [error, setError] = useState<string | null>(null);
  const [loadingKey, setLoadingKey] = useState<PackageKey | null>(null);
  const [linkNotice, setLinkNotice] = useState(false);

  const visibleSteps = useMemo(() => getVisibleSteps(answers), [answers]);
  const currentStep = visibleSteps[stepIndex];

  const recommendedPlan: RecommendedPlan = useMemo(
    () => getRecommendedPlan(answers.goal, answers.workoutPlace),
    [answers.goal, answers.workoutPlace]
  );

  function handleChange(key: keyof QuizAnswers, value: string) {
    setAnswers((prev) => {
      const next = { ...prev, [key]: value };
      // إعادة ضبط تفاصيل الإصابة إذا غيّرت إجابتها إلى "لا"
      if (key === "injury" && value === "لا") {
        next.injuryDetails = "";
      }
      return next;
    });
    setError(null);
  }

  function goToResult(finalAnswers: QuizAnswers) {
    setScreen("loading");
    saveQuizAnswers(finalAnswers);
    const plan = getRecommendedPlan(finalAnswers.goal, finalAnswers.workoutPlace);
    const lead = buildLead(finalAnswers, plan);
    console.log(lead);

    window.setTimeout(() => {
      setScreen("result");
    }, 1500);
  }

  function handleNext() {
    const validationError = currentStep.validate(answers);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (stepIndex === visibleSteps.length - 1) {
      goToResult(answers);
      return;
    }

    setStepIndex((i) => i + 1);
    setError(null);
  }

  function handleBack() {
    if (stepIndex === 0) return;
    setStepIndex((i) => i - 1);
    setError(null);
  }

  function handleSelectPackage(key: PackageKey) {
    const pkg = PRICING_PACKAGES.find((p) => p.key === key);
    if (!pkg) return;

    const lead = buildLead(answers, recommendedPlan, pkg.title, pkg.price);
    saveQuizAnswers(answers);
    saveLead(lead);
    console.log(lead);

    const checkoutUrl = SALLA_CHECKOUT_LINKS[key];
    if (!checkoutUrl || checkoutUrl.startsWith("PUT_SALLA_INSTANT_CHECKOUT")) {
      setLinkNotice(true);
      window.setTimeout(() => setLinkNotice(false), 3500);
      return;
    }

    setLoadingKey(key);
    window.location.href = checkoutUrl;
  }

  return (
    <div className="flex flex-1 flex-col">
      {screen === "hero" && (
        <HeroScreen onStart={() => setScreen("quiz")} />
      )}

      {screen === "quiz" && currentStep && (
        <QuestionScreen
          step={currentStep}
          stepKey={currentStep.id}
          answers={answers}
          error={error}
          stepIndex={stepIndex}
          totalSteps={visibleSteps.length}
          onChange={handleChange}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}

      {screen === "loading" && <LoadingScreen />}

      {screen === "result" && (
        <ResultScreen
          answers={answers}
          recommendedPlan={recommendedPlan}
          onSelectPackage={handleSelectPackage}
          loadingKey={loadingKey}
          whatsappHelperUrl={getQuizCompletionWhatsAppUrl(
            buildLead(answers, recommendedPlan)
          )}
        />
      )}

      {linkNotice && (
        <div className="animate-fade-in pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-6">
          <div className="pointer-events-auto rounded-2xl border border-yellow/40 bg-card-soft px-5 py-3 text-center text-sm font-bold text-yellow shadow-xl">
            رابط الدفع لهذه الباقة لم يُضاف بعد
          </div>
        </div>
      )}
    </div>
  );
}
