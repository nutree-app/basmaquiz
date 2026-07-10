import { Logo } from "@/components/Logo";
import { PrimaryButton } from "@/components/buttons";

export function HeroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="animate-fade-in flex flex-1 flex-col justify-between px-6 pb-8 pt-10">
      <div className="flex flex-col items-center">
        <Logo />

        <div className="mt-12 flex flex-col items-center text-center">
          <h1 className="text-3xl font-black leading-[1.4] text-foreground">
            خلينا نختار لك البرنامج الأنسب
          </h1>
          <p className="mt-4 text-base leading-7 text-muted">
            جاوبي على أسئلة بسيطة، وبنرشح لك البرنامج المناسب لهدفك وطريقة
            تمرينك.
          </p>
        </div>

        <div className="mt-10 flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow/15">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"
                fill="#FFD21A"
                stroke="#FFD21A"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-sm font-bold leading-6 text-foreground">
            خطة تمرين + تغذية مناسبة لهدفك
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-4">
        <PrimaryButton onClick={onStart}>ابدئي الآن</PrimaryButton>
        <p className="text-center text-xs text-muted">
          النتيجة تظهر لك مباشرة قبل الدفع
        </p>
      </div>
    </div>
  );
}
