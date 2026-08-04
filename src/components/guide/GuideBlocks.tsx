import { ReactNode } from "react";

// عنوان قسم مرقّم - الرقم يظهر داخل دائرة صفراء بجانب العنوان
export function GuideSection({
  step,
  title,
  children,
}: {
  step?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-12 first:mt-0">
      <div className="flex items-start gap-3">
        {step && (
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-yellow text-base font-black text-yellow-text"
          >
            {step}
          </span>
        )}
        <h2 className="text-xl font-black leading-8 text-foreground sm:text-2xl">
          {title}
        </h2>
      </div>

      <div className="mt-4">{children}</div>
    </section>
  );
}

// فقرة نص عادية بمقاس قراءة مريح
export function GuideText({ children }: { children: ReactNode }) {
  return <p className="text-base leading-8 text-muted">{children}</p>;
}

// ملاحظة مهمة - إطار وردي بارز
export function GuideNote({ children }: { children: ReactNode }) {
  return (
    <div className="mt-5 flex items-start gap-3 rounded-2xl border border-pink/40 bg-pink/10 p-4 sm:p-5">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="mt-1 shrink-0"
      >
        <circle cx="12" cy="12" r="9.5" stroke="#D64B78" strokeWidth="1.8" />
        <path
          d="M12 7.5v5.5"
          stroke="#D64B78"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="16.4" r="1.15" fill="#D64B78" />
      </svg>
      <p className="text-sm font-bold leading-7 text-foreground sm:text-base">
        {children}
      </p>
    </div>
  );
}

// بطاقة عامة - تُستخدم لبطاقات المستوى والإحماء والإطالة
export function GuideCard({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-5 shadow-lg shadow-black/20 sm:p-6">
      <h3 className="text-lg font-extrabold text-foreground">{title}</h3>
      {badge && (
        <span className="mt-3 self-start rounded-full bg-pink px-3 py-1 text-xs font-extrabold text-white">
          {badge}
        </span>
      )}
      <p className="mt-3 text-sm leading-7 text-muted sm:text-base">{children}</p>
    </div>
  );
}

// شبكة بطاقتين - فوق بعض على الجوال، وجنب بعض على الشاشات الأكبر
export function GuideCardGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}
