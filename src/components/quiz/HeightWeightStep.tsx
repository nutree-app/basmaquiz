import { calculateBmi, getBmiCategory } from "@/lib/recommendation";
import { WheelPicker } from "./WheelPicker";

const HEIGHT_VALUES = Array.from({ length: 220 - 130 + 1 }, (_, i) => 130 + i);
const WEIGHT_VALUES = Array.from({ length: 150 - 35 + 1 }, (_, i) => 35 + i);

export function HeightWeightStep({
  height,
  weight,
  onChangeHeight,
  onChangeWeight,
}: {
  height: number;
  weight: number;
  onChangeHeight: (value: number) => void;
  onChangeWeight: (value: number) => void;
}) {
  const bmi = calculateBmi(height, weight);
  const category = getBmiCategory(bmi);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center gap-3">
          <span className="text-sm font-bold text-ob-text-dim">الطول</span>
          <WheelPicker values={HEIGHT_VALUES} value={height} onChange={onChangeHeight} suffix="سم" />
        </div>
        <div className="flex flex-col items-center gap-3">
          <span className="text-sm font-bold text-ob-text-dim">الوزن الحالي</span>
          <WheelPicker values={WEIGHT_VALUES} value={weight} onChange={onChangeWeight} suffix="كجم" />
        </div>
      </div>

      {bmi > 0 && (
        <div className="animate-ob-rise rounded-[22px] border border-white/[0.07] bg-ob-card px-5 py-4 text-center">
          <p className="text-sm text-ob-text-dim">مؤشر كتلة الجسم (BMI)</p>
          <p className="mt-1 text-[26px] font-extrabold text-white tabular-nums">{bmi.toFixed(1)}</p>
          {category && <p className="mt-1 text-sm font-bold text-wk-pink-text">{category}</p>}
        </div>
      )}
    </div>
  );
}
