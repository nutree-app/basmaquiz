import { PrimaryButton } from "./buttons";

export function PlanOptionCard({
  title,
  price,
  buttonLabel,
  onSelect,
}: {
  title: string;
  price: string;
  buttonLabel: string;
  onSelect: () => void;
}) {
  return (
    <div className="flex flex-col rounded-3xl border border-pink bg-card-soft p-6">
      <h4 className="text-center text-xl font-extrabold text-foreground">{title}</h4>
      <p className="mt-2 text-center text-3xl font-black text-yellow">{price}</p>
      <div className="mt-5">
        <PrimaryButton onClick={onSelect}>{buttonLabel}</PrimaryButton>
      </div>
    </div>
  );
}
