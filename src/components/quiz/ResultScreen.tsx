import { ProductCard } from "@/components/ProductCard";
import { PlanOptionCard } from "@/components/PlanOptionCard";
import { WhatsAppButton } from "@/components/buttons";
import { PRODUCTS } from "@/lib/products";
import {
  buildResultExplanation,
  buildResultTitle,
  getComparisonPlan,
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
  const { basic, upsell } = getComparisonPlan(answers);

  return (
    <div className="animate-fade-in flex flex-1 flex-col px-6 pb-10 pt-10">
      <div className="text-center">
        <h2 className="text-2xl font-black leading-tight text-foreground">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-muted">{explanation}</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <ProductCard
          product={PRODUCTS[upsell]}
          highlighted
          onSelect={() => onSelectProduct(upsell)}
        />
        <ProductCard
          product={PRODUCTS[basic]}
          onSelect={() => onSelectProduct(basic)}
        />
      </div>

      <div className="mt-10 h-px w-full bg-border/60" aria-hidden="true" />

      <div className="mt-8">
        <div className="text-center">
          <h3 className="text-lg font-extrabold text-foreground">
            أو إذا كنت تفضلين جدول تمارين بدون متابعة
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            اختاري الخيار المناسب لأسلوب حياتك.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <PlanOptionCard
            emoji="🏠"
            title="المنزل"
            description={PRODUCTS.HOME_TABLE.description}
            onSelect={() => onSelectProduct("HOME_TABLE")}
          />
          <PlanOptionCard
            emoji="🏋️‍♀️"
            title="النادي"
            description={PRODUCTS.GYM_TABLE.description}
            onSelect={() => onSelectProduct("GYM_TABLE")}
          />
        </div>
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
