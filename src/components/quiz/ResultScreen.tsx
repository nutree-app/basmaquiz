import { ProductCard } from "@/components/ProductCard";
import { WhatsAppButton } from "@/components/buttons";
import { PRODUCTS } from "@/lib/products";
import {
  buildResultExplanation,
  buildResultTitle,
  getRecommendedProduct,
} from "@/lib/recommendation";
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

  return (
    <div className="animate-fade-in flex flex-1 flex-col px-6 pb-10 pt-10">
      <div className="text-center">
        <h2 className="text-2xl font-black leading-tight text-foreground">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-muted">{explanation}</p>
      </div>

      <div className="mt-8">
        <ProductCard
          product={PRODUCTS[recommended]}
          onSelect={() => onSelectProduct(recommended)}
        />
      </div>

      <div className="mt-8 rounded-3xl border border-border bg-card p-6 text-center">
        <h4 className="text-lg font-extrabold text-foreground">
          تحتاجين مساعدة في اختيار البرنامج؟
        </h4>
        <p className="mt-2 text-sm leading-6 text-muted">
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
  );
}
