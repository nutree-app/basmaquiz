import { Product } from "@/lib/products";
import { PrimaryButton, SecondaryButton } from "./buttons";

export function ProductCard({
  product,
  badge,
  highlighted = false,
  onSelect,
}: {
  product: Product;
  badge?: string;
  highlighted?: boolean;
  onSelect: () => void;
}) {
  const Button = highlighted ? PrimaryButton : SecondaryButton;

  return (
    <div
      className={`relative flex flex-col rounded-3xl border p-6 transition-transform ${
        highlighted
          ? "glow-pink z-10 scale-[1.03] border-pink bg-card-soft"
          : "border-border bg-card"
      }`}
    >
      {badge && (
        <span className="absolute -top-3 right-1/2 translate-x-1/2 whitespace-nowrap rounded-full bg-pink px-4 py-1 text-xs font-extrabold text-white">
          {badge}
        </span>
      )}

      <h3 className="mt-2 text-center text-xl font-extrabold text-foreground">
        {product.title}
      </h3>

      <p className="mt-2 text-center text-3xl font-black text-yellow">
        {product.price}
      </p>

      <p className="mt-3 text-center text-sm leading-6 text-muted">
        {product.description}
      </p>

      <div className="mt-6">
        <Button onClick={onSelect}>{product.buttonLabel}</Button>
      </div>
    </div>
  );
}
