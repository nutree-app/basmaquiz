import { Logo } from "@/components/Logo";
import { PricingCard } from "@/components/PricingCard";
import { WhatsAppButton } from "@/components/buttons";
import { PRICING_PACKAGES } from "@/lib/packages";
import { needsHealthNotice } from "@/lib/recommendation";
import { PackageKey, QuizAnswers, RecommendedPlan } from "@/lib/types";

const SUMMARY_ROWS: { label: string; key: keyof QuizAnswers }[] = [
  { label: "الهدف", key: "goal" },
  { label: "مكان التمرين", key: "workoutPlace" },
  { label: "المستوى", key: "level" },
  { label: "عدد أيام التمرين", key: "trainingDays" },
  { label: "النظام المفضل", key: "dietPreference" },
];

export function ResultScreen({
  answers,
  recommendedPlan,
  onSelectPackage,
  loadingKey,
  whatsappHelperUrl,
}: {
  answers: QuizAnswers;
  recommendedPlan: RecommendedPlan;
  onSelectPackage: (key: PackageKey) => void;
  loadingKey: PackageKey | null;
  whatsappHelperUrl: string;
}) {
  const showHealthNotice = needsHealthNotice(answers);

  return (
    <div className="animate-fade-in flex flex-1 flex-col px-6 pb-10 pt-6">
      <div className="flex justify-center">
        <Logo size="sm" />
      </div>

      <div className="mt-8 rounded-3xl border border-pink/40 bg-card p-6">
        <p className="text-center text-sm font-bold text-pink">
          الخطة الأنسب لك
        </p>
        <h2 className="mt-2 text-center text-3xl font-black text-foreground">
          {recommendedPlan}
        </h2>

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

        <p className="mt-5 text-center text-sm leading-7 text-muted">
          بناء على اجاباتك، هذه الخطة هي الأنسب لهدفك الحالي وتساعدك تبدئين
          بخطوات واضحة.
        </p>

        {showHealthNotice && (
          <div className="mt-5 rounded-2xl border border-yellow/40 bg-yellow/10 p-4">
            <p className="text-center text-sm font-bold leading-6 text-yellow">
              مهم: بما ان عندك حالة صحية او حمل/رضاعة، يفضل استشارة الطبيب
              قبل بدء اي نظام غذائي او تمرين.
            </p>
          </div>
        )}
      </div>

      <div className="mt-10 text-center">
        <h3 className="text-2xl font-black text-foreground">
          اختاري مدة الاشتراك
        </h3>
        <p className="mt-2 text-sm text-muted">
          كل الباقات تشمل خطة تمرين وتغذية حسب هدفك
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        {PRICING_PACKAGES.map((pkg) => (
          <PricingCard
            key={pkg.key}
            pkg={pkg}
            onSelect={() => onSelectPackage(pkg.key)}
            loading={loadingKey === pkg.key}
          />
        ))}
      </div>

      <p className="mt-6 text-center text-xs leading-6 text-muted">
        بعد الدفع، ارسلي الفاتورة على واتساب عشان نفعّل تسجيلك ونرسل لك
        الخطوات التالية.
      </p>

      <div className="mt-8 rounded-3xl border border-border bg-card p-6 text-center">
        <h4 className="text-lg font-extrabold text-foreground">بعد الدفع</h4>
        <p className="mt-2 text-sm leading-6 text-muted">
          احتفظي بالفاتورة وارسليها لنا على الواتساب لتفعيل تسجيلك.
        </p>
        <div className="mt-5">
          <WhatsAppButton href={whatsappHelperUrl}>
            تواصل واتساب
          </WhatsAppButton>
        </div>
      </div>
    </div>
  );
}
