"use client";

import { useEffect, useState } from "react";
import { HeroScreen } from "./HeroScreen";
import { QuestionScreen } from "./QuestionScreen";
import { LoadingScreen } from "./LoadingScreen";
import { ResultScreen } from "./ResultScreen";
import { QUIZ_STEPS, validateStep } from "@/lib/quiz-steps";
import { EMPTY_ANSWERS, ProductKey, QuizAnswers } from "@/lib/types";
import { buildLead, loadQuizAnswers, saveLead, saveQuizAnswers } from "@/lib/storage";
import { PRODUCTS } from "@/lib/products";
import { trackEvent } from "@/lib/analytics";

type Screen = "hero" | "quiz" | "loading" | "result";

const RESULT_TRANSITION_MS = 1500;

export function QuizFunnel() {
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

  function handleChange(key: keyof QuizAnswers, value: string | number) {
    setAnswers((prev) => {
      const next = { ...prev, [key]: value } as QuizAnswers;
      saveQuizAnswers(next);
      return next;
    });
    setError(null);
  }

  function goToResult(finalAnswers: QuizAnswers) {
    setScreen("loading");
    saveQuizAnswers(finalAnswers);
    trackEvent("quiz_completed", {
      goal: finalAnswers.goal,
      trainingPreference: finalAnswers.trainingPreference,
      level: finalAnswers.level,
      weeklyDays: finalAnswers.weeklyDays,
      programType: finalAnswers.programType,
    });

    window.setTimeout(() => {
      setScreen("result");
    }, RESULT_TRANSITION_MS);
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

  function handleSelectProduct(key: ProductKey) {
    const product = PRODUCTS[key];
    if (!product) return;

    const lead = buildLead(answers, product.title, key, product.title, product.price);
    saveLead(lead);
    trackEvent("product_selected", {
      productKey: key,
      productTitle: product.title,
    });

    window.location.href = product.link;
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
        <ResultScreen answers={answers} onSelectProduct={handleSelectProduct} />
      )}
    </div>
  );
}
