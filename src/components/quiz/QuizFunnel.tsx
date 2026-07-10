"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { HeroScreen } from "./HeroScreen";
import { QuestionScreen } from "./QuestionScreen";
import { LoadingScreen } from "./LoadingScreen";
import { ResultScreen } from "./ResultScreen";
import { QUIZ_STEPS, validateStep } from "@/lib/quiz-steps";
import { getRecommendedPlan } from "@/lib/recommendation";
import { EMPTY_ANSWERS, PackageKey, QuizAnswers, RecommendedPlan } from "@/lib/types";
import { buildLead, loadQuizAnswers, saveLead, saveQuizAnswers } from "@/lib/storage";
import { PRICING_PACKAGES } from "@/lib/packages";
import { trackEvent } from "@/lib/analytics";

type Screen = "hero" | "quiz" | "loading" | "result";

export function QuizFunnel() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("hero");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(EMPTY_ANSWERS);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = loadQuizAnswers();
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnswers(saved);
    }
  }, []);

  const currentStep = QUIZ_STEPS[stepIndex];

  const recommendedPlan: RecommendedPlan = useMemo(
    () => getRecommendedPlan(answers.goal, answers.trainingLocation),
    [answers.goal, answers.trainingLocation]
  );

  function handleChange(key: keyof QuizAnswers, value: string) {
    setAnswers((prev) => {
      const next = { ...prev, [key]: value };
      saveQuizAnswers(next);
      return next;
    });
    setError(null);
  }

  function goToResult(finalAnswers: QuizAnswers) {
    setScreen("loading");
    saveQuizAnswers(finalAnswers);
    const plan = getRecommendedPlan(finalAnswers.goal, finalAnswers.trainingLocation);
    trackEvent("quiz_completed", {
      goal: finalAnswers.goal,
      trainingLocation: finalAnswers.trainingLocation,
      level: finalAnswers.level,
      trainingDays: finalAnswers.trainingDays,
      mainPreference: finalAnswers.mainPreference,
      recommendedPlan: plan,
    });

    window.setTimeout(() => {
      setScreen("result");
    }, 1500);
  }

  function handleNext() {
    const validationError = validateStep(currentStep, answers);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (stepIndex === QUIZ_STEPS.length - 1) {
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

    const lead = buildLead(answers, recommendedPlan, key, pkg.title, pkg.price);
    saveLead(lead);
    trackEvent("package_selected", {
      packageKey: key,
      packageTitle: pkg.title,
      price: pkg.price,
    });

    router.push(`/checkout/${key}`);
  }

  return (
    <div className="flex flex-1 flex-col">
      {screen === "hero" && (
        <HeroScreen onStart={() => setScreen("quiz")} />
      )}

      {screen === "quiz" && currentStep && (
        <QuestionScreen
          step={currentStep}
          answers={answers}
          error={error}
          stepIndex={stepIndex}
          totalSteps={QUIZ_STEPS.length}
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
        />
      )}
    </div>
  );
}
