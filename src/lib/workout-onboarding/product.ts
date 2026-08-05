import { PRODUCT_LINKS } from "@/lib/config";
import type { Goal } from "@/lib/onboarding/types";

/**
 * Goal → Basmafit product.
 *
 * The URLs are the ones already configured in lib/config.ts for the quiz — no
 * new link is invented here, and no Nutree / Coach Nada / Memafit / Nena Fit
 * destination is ever used.
 *
 *   فقدان الوزن   (lose)     → برنامج التنشيف
 *   زيادة الوزن   (gain)     → برنامج التضخيم
 *   المحافظة     (maintain) → برنامج طلتي غير, the existing default
 */
export type BasmafitProductKey = "CUTTING_PACKAGE" | "BULKING_PACKAGE" | "TALATI_GHEIR";

export interface BasmafitProduct {
  key: BasmafitProductKey;
  title: string;
  url: string;
}

const PRODUCTS: Record<BasmafitProductKey, BasmafitProduct> = {
  CUTTING_PACKAGE: {
    key: "CUTTING_PACKAGE",
    title: "برنامج التنشيف",
    url: PRODUCT_LINKS.CUTTING_PACKAGE,
  },
  BULKING_PACKAGE: {
    key: "BULKING_PACKAGE",
    title: "برنامج التضخيم",
    url: PRODUCT_LINKS.BULKING_PACKAGE,
  },
  TALATI_GHEIR: {
    key: "TALATI_GHEIR",
    title: "برنامج طلتي غير",
    url: PRODUCT_LINKS.TALATI_GHEIR,
  },
};

/**
 * Resolved from the goal answered on step 3. Maintain — and an unanswered goal,
 * which the flow's validation makes unreachable — both fall through to the
 * existing default product.
 */
export function getBasmafitProduct(goal: Goal | null): BasmafitProduct {
  if (goal === "lose") return PRODUCTS.CUTTING_PACKAGE;
  if (goal === "gain") return PRODUCTS.BULKING_PACKAGE;
  return PRODUCTS.TALATI_GHEIR;
}
