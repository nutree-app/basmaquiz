import { PricingPackage } from "@/lib/packages";
import { PrimaryButton, SecondaryButton } from "./buttons";

export function PricingCard({
  pkg,
  onSelect,
  loading,
}: {
  pkg: PricingPackage;
  onSelect: () => void;
  loading: boolean;
}) {
  const Button = pkg.highlighted ? PrimaryButton : SecondaryButton;

  return (
    <div
      className={`relative flex flex-col rounded-3xl border p-6 transition-transform ${
        pkg.highlighted
          ? "glow-pink z-10 scale-[1.03] border-pink bg-card-soft"
          : "border-border bg-card"
      }`}
    >
      {pkg.badge && (
        <span
          className={`absolute -top-3 right-1/2 translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1 text-xs font-extrabold ${
            pkg.highlighted
              ? "bg-pink text-white"
              : "bg-yellow text-yellow-text"
          }`}
        >
          {pkg.badge}
        </span>
      )}

      <h3 className="mt-2 text-center text-xl font-extrabold text-foreground">
        {pkg.title}
      </h3>
      <p className="mt-2 text-center text-3xl font-black text-yellow">
        {pkg.price}
      </p>
      <p className="mt-3 text-center text-sm leading-6 text-muted">
        {pkg.description}
      </p>

      <ul className="mt-5 flex flex-col gap-2.5">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="mt-0.5 shrink-0"
            >
              <circle cx="12" cy="12" r="10" fill="#D64B78" opacity="0.15" />
              <path
                d="M8 12.5l2.5 2.5L16 9.5"
                stroke="#D64B78"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="leading-6">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <Button onClick={onSelect} disabled={loading}>
          {loading ? "جارٍ التحويل..." : pkg.buttonLabel}
        </Button>
      </div>
    </div>
  );
}
