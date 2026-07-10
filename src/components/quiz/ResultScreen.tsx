import { Logo } from "@/components/Logo";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/products";
import {
  buildResultSummary,
  getObstacleNote,
  getRecommendedPlanLabel,
  getRecommendedProducts,
  getWeightGoalNote,
} from "@/lib/recommendation";
import { ProductKey, QuizAnswers } from "@/lib/types";

const SUMMARY_ROWS: { label: string; key: keyof QuizAnswers }[] = [
  { label: "الهدف", key: "goal" },
  { label: "مكان التمرين", key: "trainingLocation" },
  { label: "المستوى", key: "level" },
  { label: "عدد أيام التمرين", key: "trainingDays" },
];

export function ResultScreen({
  answers,
  onSelectProduct,
}: {
  answers: QuizAnswers;
  onSelectProduct: (key: ProductKey) => void;
}) {
  const recommendedPlanLabel = getRecommendedPlanLabel(answers.goal, answers.trainingLocation);
  const summarySentence = buildResultSummary(answers);
  const obstacleNote = getObstacleNote(answers.mainObstacle);
  const weightGoalNote = getWeightGoalNote(answers.currentWeight, answers.targetWeight);
  const productKeys = getRecommendedProducts(answers);

  return (
    <div className="animate-fade-in flex flex-1 flex-col px-6 pb-10 pt-6">
      <div className="flex justify-center">
        <Logo size="sm" />
      </div>

      <div className="mt-8 rounded-3xl border border-pink/40 bg-card p-6">
        <p className="text-center text-sm font-bold text-pink">الخطة الأنسب لك</p>
        <h2 className="mt-2 text-center text-3xl font-black text-foreground">
          {recommendedPlanLabel}
        </h2>

        <p className="mt-5 text-center text-sm leading-7 text-muted">
          {summarySentence}
        </p>

        {obstacleNote && (
          <p className="mt-3 text-center text-sm leading-6 text-pink">{obstacleNote}</p>
        )}

        {weightGoalNote && (
          <p className="mt-2 text-center text-sm leading-6 text-muted">{weightGoalNote}</p>
        )}

        <div className="mt-6 flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border">
          {SUMMARY_ROWS.map((row) => (
            <div
              key={row.key}
              className="flex items-center justify-between bg-card-soft px-4 py-3 text-sm"
            >
              <span className="text-muted">{row.label}</span>
              <span className="font-bold text-foreground">
                {answers[row.key] || "—"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 text-center">
        <h3 className="text-2xl font-black text-foreground">المنتجات المناسبة لك</h3>
        <p className="mt-2 text-sm text-muted">اختاري المنتج اللي يناسب احتياجك</p>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        {productKeys.map((key) => (
          <ProductCard
            key={key}
            product={PRODUCTS[key]}
            onSelect={() => onSelectProduct(key)}
          />
        ))}
      </div>
    </div>
  );
}
