"use client";

import { useCallback, useRef, useState } from "react";
import { HeroScreen } from "./HeroScreen";
import { QuestionScreen } from "./QuestionScreen";
import { LoadingScreen } from "./LoadingScreen";
import { ResultScreen } from "./ResultScreen";
import { QUIZ_STEPS, validateStep } from "@/lib/quiz-steps";
import { EMPTY_ANSWERS, ProductKey, QuizAnswers } from "@/lib/types";
import { buildLead, resetQuizState, saveLead } from "@/lib/storage";
import { PRODUCTS } from "@/lib/products";
import { trackEvent } from "@/lib/analytics";

type Screen = "hero" | "quiz" | "loading" | "result";

export function QuizFunnel() {
  const [screen, setScreen] = useState<Screen>("hero");
  const [stepIndex, setStepIndex] = useState(0);
  // كل زيارة تبدأ من الصفر: نمسح أي إجابات محفوظة عند أول تركيب فقط
  const [answers, setAnswers] = useState<QuizAnswers>(() => {
    resetQuizState();
    return EMPTY_ANSWERS;
  });
  const [error, setError] = useState<string | null>(null);
  const selectedRef = useRef(new Set<ProductKey>());

  const currentStep = QUIZ_STEPS[stepIndex];

  function handleChange(key: keyof QuizAnswers, value: string | number) {
    setAnswers((prev) => ({ ...prev, [key]: value }) as QuizAnswers);
    setError(null);
  }

  // تُستدعى فقط عند اكتمال أنيميشن تحضير الخطة (وصول النسبة إلى 100%)،
  // وليست تأخيرًا زمنيًا ثابتًا؛ هذا يضمن عدم الانتقال للنتيجة قبل اكتمال العرض
  const handleLoadingComplete = useCallback(() => {
    setScreen("result");
  }, []);

  function handleNext() {
    const validationError = validateStep(currentStep, answers);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (stepIndex === QUIZ_STEPS.length - 1) {
      setScreen("loading");
      trackEvent("quiz_completed", {
        goal: answers.goal,
        trainingPreference: answers.trainingPreference,
        level: answers.level,
        weeklyDays: answers.weeklyDays,
        programType: answers.programType,
      });
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

  // البطاقة نفسها رابط، فالتنقل يتم عبر <a>؛ هنا نسجّل الاختيار مرة واحدة فقط
  function handleSelectProduct(key: ProductKey) {
    if (selectedRef.current.has(key)) return;
    const product = PRODUCTS[key];
    if (!product) return;
    selectedRef.current.add(key);

    const lead = buildLead(answers, product.title, key, product.title, product.price);
    saveLead(lead);
    trackEvent("product_selected", {
      productKey: key,
      productTitle: product.title,
    });
  }

  return (
    <div className="flex flex-1 flex-col">
      {screen === "hero" && <HeroScreen onStart={() => setScreen("quiz")} />}

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

      {screen === "loading" && <LoadingScreen onComplete={handleLoadingComplete} />}

      {screen === "result" && (
        <ResultScreen answers={answers} onSelectProduct={handleSelectProduct} />
      )}
    </div>
  );
}
