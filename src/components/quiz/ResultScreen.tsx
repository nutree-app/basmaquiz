import { Logo } from "@/components/Logo";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/products";
import {
  buildResultExplanation,
  buildResultTitle,
  getAlternativeProduct,
  getRecommendedProduct,
} from "@/lib/recommendation";
import { ProductKey, QuizAnswers } from "@/lib/types";

export function ResultScreen({
  answers,
  onSelectProduct,
}: {
  answers: QuizAnswers;
  onSelectProduct: (key: ProductKey) => void;
}) {
  const title = buildResultTitle();
  const explanation = buildResultExplanation(answers);
  const recommendedKey = getRecommendedProduct(answers);
  const alternativeKey = getAlternativeProduct(recommendedKey);

  return (
    <div className="animate-fade-in flex flex-1 flex-col px-6 pb-10 pt-6">
      <div className="flex justify-center">
        <Logo size="sm" />
      </div>

      <div className="mt-8 text-center">
        <h2 className="text-2xl font-black leading-tight text-foreground">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-muted">{explanation}</p>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        <ProductCard
          product={PRODUCTS[recommendedKey]}
          badge="الأنسب لك"
          highlighted
          onSelect={() => onSelectProduct(recommendedKey)}
        />
        <ProductCard
          product={PRODUCTS[alternativeKey]}
          onSelect={() => onSelectProduct(alternativeKey)}
        />
      </div>
    </div>
  );
}
