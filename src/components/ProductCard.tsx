import { Product } from "@/lib/products";
import { PrimaryButton } from "./buttons";

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path
        d="M5 13l4 4L19 7"
        stroke="#34D399"
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
    <div className="glow-pink relative z-10 flex flex-col rounded-3xl border border-pink bg-card-soft p-6">
      <span className="absolute -top-3 right-1/2 translate-x-1/2 whitespace-nowrap rounded-full bg-pink px-4 py-1 text-xs font-extrabold text-white">
        الأكثر طلبا
      </span>

      <h3 className="mt-2 text-center text-xl font-extrabold text-foreground">
        {product.title}
      </h3>

      <p className="mt-2 text-center text-3xl font-black text-yellow">
        {product.price}
      </p>

      <ul className="mt-5 flex flex-col gap-2">
        {product.features.map((feature) => (
          <li key={feature.label} className="flex items-center gap-2 text-sm">
            {feature.included ? <CheckIcon /> : <XIcon />}
            <span className={feature.included ? "text-foreground" : "text-muted opacity-70"}>
              {feature.label}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-center text-xs leading-5 text-muted">
        الخيار الأشمل — يعطيك قيمة أكبر ونتائج أوضح.
      </p>

      <div className="mt-5">
        <PrimaryButton onClick={onSelect}>{product.buttonLabel}</PrimaryButton>
      </div>
    </div>
  );
}
