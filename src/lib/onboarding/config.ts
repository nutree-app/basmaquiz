/**
 * Where the web onboarding sends people once their plan is ready.
 *
 * This funnel never takes payment — it exists to warm the visitor up and hand
 * them to the Basmafit storefront, where the Nutree Pro purchase and the
 * activation-code fulfilment actually happen.
 */

export const BASMAFIT_PRODUCT_URL =
  process.env.NEXT_PUBLIC_BASMAFIT_PRODUCT_URL || "https://basmafit.com/-/p1805354242";

/**
 * Nutree Pro pricing shown on the offer screen. Kept here rather than in
 * lib/products.ts because this is a Nutree subscription sold through the
 * Basmafit storefront, not one of the coaching packages the quiz recommends.
 */
export const PLAN_PRICE = 59;
export const PLAN_CURRENCY = "SAR";
export const PLAN_ORIGINAL_PRICE = 149;
export const PLAN_DISCOUNT_PERCENT = Math.round(
  ((PLAN_ORIGINAL_PRICE - PLAN_PRICE) / PLAN_ORIGINAL_PRICE) * 100
); // 60

/**
 * The welcome screen's "already have an account" link. Points at the Nutree
 * download page, since this site has no account area of its own.
 */
export const NUTREE_DOWNLOAD_URL = "https://getnutree.app/download";

/** Analytics event names for the onboarding funnel. */
export const ONBOARDING_EVENTS = {
  start: "onboarding_start",
  stepView: "onboarding_step_view",
  planReady: "onboarding_plan_ready",
  offerView: "onboarding_offer_view",
  checkoutClick: "onboarding_checkout_click",
} as const;

/** Persisted so a refresh (or an accidental back-swipe) doesn't wipe progress. */
export const ONBOARDING_STORAGE_KEY = "nutree.onboarding.v1";
