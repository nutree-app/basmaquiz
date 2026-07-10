import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/products";
import {
  buildResultExplanation,
  buildResultTitle,
  getRecommendedProducts,
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
  const productKeys = getRecommendedProducts(answers);

  return (
    <div className="animate-fade-in flex flex-1 flex-col px-6 pb-10 pt-10">
      <div className="text-center">
        <h2 className="text-2xl font-black leading-tight text-foreground">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-muted">{explanation}</p>
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
