import { Product } from "@/lib/products";
import { WorkoutPrimaryButton } from "./workout/WorkoutButtons";

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path
        d="M5 13l4 4L19 7"
        stroke="#4ADE80"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 opacity-60">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="#CFCFCF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProductCard({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: () => void;
}) {
  return (
    <div className="relative z-10 flex flex-col rounded-[26px] border border-wk-pink/40 bg-ob-card p-6 shadow-[0_0_0_1px_rgba(180,70,105,0.25),0_18px_44px_-22px_rgba(180,70,105,0.7)]">
      <span className="absolute -top-3 right-1/2 translate-x-1/2 whitespace-nowrap rounded-full bg-wk-pink px-4 py-1 text-xs font-extrabold text-white">
        الأكثر طلبا
      </span>

      <h3 className="mt-2 text-center text-[20px] font-extrabold text-white">
        {product.title}
      </h3>

      <p className="mt-2 text-center text-[30px] font-extrabold text-wk-pink-text">
        {product.price}
      </p>

      <ul className="mt-5 flex flex-col gap-2">
        {product.features.map((feature) => (
          <li key={feature.label} className="flex items-center gap-2 text-sm">
            {feature.included ? <CheckIcon /> : <XIcon />}
            <span className={feature.included ? "text-white/90" : "text-ob-text-faint"}>
              {feature.label}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-center text-xs leading-5 text-ob-text-faint">
        الخيار الأشمل — يعطيك قيمة أكبر ونتائج أوضح.
      </p>

      <div className="mt-5">
        <WorkoutPrimaryButton onClick={onSelect}>{product.buttonLabel}</WorkoutPrimaryButton>
      </div>
    </div>
  );
}
