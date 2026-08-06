import { ProductCard } from "@/components/ProductCard";
import { WhatsAppButton } from "@/components/buttons";
import { PRODUCTS } from "@/lib/products";
import {
  buildResultExplanation,
  buildResultTitle,
  getRecommendedProducts,
  hasExclusiveRecommendation,
} from "@/lib/recommendation";
import { ProductKey, QuizAnswers } from "@/lib/types";
import { getResultWhatsAppUrl } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

// بطاقة مصغّرة لجدول التمارين - تُعرض فقط في قسم "أو جدول تمارين بدون متابعة"
function TableOptionCard({
  emoji,
  title,
  description,
  href,
  onSelect,
}: {
  emoji: string;
  title: string;
  description: string;
  href: string;
  onSelect: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onSelect}
      className="flex flex-col items-center rounded-2xl border border-border bg-card p-4 text-center transition-transform active:scale-[0.98] hover:border-muted"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow/15 text-lg">
        {emoji}
      </span>
      <h4 className="mt-3 text-base font-extrabold text-foreground">{title}</h4>
      <p className="mt-1 text-xs leading-5 text-muted">{description}</p>
    </a>
  );
}

export function ResultScreen({
  answers,
  onSelectProduct,
}: {
  answers: QuizAnswers;
  onSelectProduct: (key: ProductKey) => void;
}) {
  const title = buildResultTitle();
  const explanation = buildResultExplanation(answers);
  const recommended = getRecommendedProducts(answers);
  const isSingle = recommended.length === 1;
  // الترشيح الحصري يغني عن عرض الجداول كبديل
  const showTables = !hasExclusiveRecommendation(answers);

  return (
    <div className="animate-fade-in flex flex-1 flex-col px-6 pb-10 pt-10">
      <div className="text-center">
        <h2 className="text-2xl font-black leading-tight text-foreground">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-muted">{explanation}</p>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {recommended.map((key) => (
          <ProductCard
            key={key}
            product={PRODUCTS[key]}
            highlighted={isSingle}
            onSelect={() => onSelectProduct(key)}
          />
        ))}
      </div>

      {showTables && (
        <>
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
              <TableOptionCard
                emoji="🏠"
                title="المنزل"
                description={PRODUCTS.HOME_TABLE.description}
                href={PRODUCTS.HOME_TABLE.link}
                onSelect={() => onSelectProduct("HOME_TABLE")}
              />
              <TableOptionCard
                emoji="🏋️‍♀️"
                title="النادي"
                description={PRODUCTS.GYM_TABLE.description}
                href={PRODUCTS.GYM_TABLE.link}
                onSelect={() => onSelectProduct("GYM_TABLE")}
              />
            </div>
          </div>
        </>
      )}

      <div
        className={`rounded-3xl border border-border bg-card p-6 text-center ${
          showTables ? "mt-8" : "mt-10"
        }`}
      >
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
