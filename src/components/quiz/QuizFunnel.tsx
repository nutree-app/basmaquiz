"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { HeroScreen } from "./HeroScreen";
import { QuestionScreen } from "./QuestionScreen";
import { LoadingScreen } from "./LoadingScreen";
import { ResultScreen } from "./ResultScreen";
import { WorkoutShell } from "@/components/workout/WorkoutShell";
import { WorkoutProgress } from "@/components/workout/WorkoutProgress";
import { QUIZ_STEPS, STEP_IDS, TOTAL_STEPS, validateStep } from "@/lib/quiz-steps";
import {
  EMPTY_ANSWERS,
  ProductKey,
  QuizAnswers,
  TRAINING_DAYS_LABEL,
  TRAINING_LOCATION_LABEL,
} from "@/lib/types";
import { buildLead, clearWorkoutState, saveLead } from "@/lib/storage";
import { PRODUCTS } from "@/lib/products";
import { trackEvent } from "@/lib/analytics";

type Screen = "hero" | "quiz" | "loading" | "result";

interface Boot {
  token: "server" | "client";
  answers: QuizAnswers;
  screen: Screen;
  stepIndex: number;
}

const SERVER_BOOT: Boot = {
  token: "server",
  answers: EMPTY_ANSWERS,
  screen: "hero",
  stepIndex: 0,
};

/** Cached so useSyncExternalStore sees a stable snapshot across renders. */
let clientBoot: Boot | undefined;

/** ?step=<id|index> opens a specific question directly. */
function readRequestedStep(): number | null {
  const requested = new URLSearchParams(window.location.search).get("step");
  if (!requested) return null;

  const byId = STEP_IDS.indexOf(requested);
  const index = byId >= 0 ? byId : Number(requested);
  return Number.isInteger(index) && index >= 0 && index < TOTAL_STEPS ? index : null;
}

function getClientBoot(): Boot {
  if (!clientBoot) {
    // Every visit starts a brand-new run: wipe anything a previous session
    // left behind so a returning visitor can never land on an old result.
    clearWorkoutState();
    const requestedStep = readRequestedStep();

    clientBoot = {
      token: "client",
      answers: EMPTY_ANSWERS,
      // ?step= still opens a screen directly, but with a blank sheet.
      screen: requestedStep !== null ? "quiz" : "hero",
      stepIndex: requestedStep ?? 0,
    };
  }
  return clientBoot;
}

function getServerBoot(): Boot {
  return SERVER_BOOT;
}

function subscribe(): () => void {
  return () => {};
}

export function QuizFunnel() {
  const boot = useSyncExternalStore(subscribe, getClientBoot, getServerBoot);
  // Remounting on the token flip lets restored progress arrive as initial
  // state, so the server and the hydrating client render identical markup.
  return <Funnel key={boot.token} boot={boot} />;
}

function Funnel({ boot }: { boot: Boot }) {
  const [screen, setScreen] = useState<Screen>(boot.screen);
  const [stepIndex, setStepIndex] = useState(boot.stepIndex);
  const [answers, setAnswers] = useState<QuizAnswers>(boot.answers);
  const [error, setError] = useState<string | null>(null);

  const currentStep = QUIZ_STEPS[stepIndex];

  function handleChange(key: keyof QuizAnswers, value: string | number) {
    setAnswers((prev) => ({ ...prev, [key]: value }) as QuizAnswers);
    setError(null);
  }

  function goToResult(finalAnswers: QuizAnswers) {
    setScreen("loading");
    trackEvent("quiz_completed", {
      goal: finalAnswers.goal,
      // Legacy parameter names kept so existing dashboards keep reporting —
      // now carrying the Arabic labels for the two redesigned answers.
      trainingPreference: finalAnswers.trainingLocation
        ? TRAINING_LOCATION_LABEL[finalAnswers.trainingLocation]
        : "",
      weeklyDays: finalAnswers.trainingDays
        ? TRAINING_DAYS_LABEL[finalAnswers.trainingDays]
        : "",
      // Canonical values for the redesigned questions.
      trainingLocation: finalAnswers.trainingLocation,
      trainingDays: finalAnswers.trainingDays,
      level: finalAnswers.level,
      programType: finalAnswers.programType,
    });
  }

  // Fires when the preparing-plan animation reaches 100%, not on a fixed timer,
  // so the result never appears before the animation has finished.
  const handleLoadingComplete = useCallback(() => {
    setScreen("result");
  }, []);

  function handleNext() {
    const validationError = validateStep(currentStep, answers);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (stepIndex === TOTAL_STEPS - 1) {
      goToResult(answers);
      return;
    }

    setStepIndex((i) => i + 1);
    setError(null);
  }

  function handleBack() {
    if (stepIndex === 0) {
      setScreen("hero");
      return;
    }
    setStepIndex((i) => i - 1);
    setError(null);
  }

  function handleStart() {
    setScreen("quiz");
    setStepIndex(0);
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
    <WorkoutShell>
      {screen === "quiz" && <WorkoutProgress current={stepIndex} total={TOTAL_STEPS} />}

      <main className="flex min-h-0 flex-1 flex-col">
        {screen === "hero" && <HeroScreen onStart={handleStart} />}

        {screen === "quiz" && currentStep && (
          <div key={currentStep.id} className="animate-ob-enter flex min-h-0 flex-1 flex-col">
            <QuestionScreen
              step={currentStep}
              answers={answers}
              error={error}
              stepIndex={stepIndex}
              totalSteps={TOTAL_STEPS}
              onChange={handleChange}
              onNext={handleNext}
              onBack={handleBack}
            />
          </div>
        )}

        {screen === "loading" && <LoadingScreen onComplete={handleLoadingComplete} />}

        {screen === "result" && (
          <ResultScreen answers={answers} onSelectProduct={handleSelectProduct} />
        )}
      </main>
    </WorkoutShell>
  );
}
