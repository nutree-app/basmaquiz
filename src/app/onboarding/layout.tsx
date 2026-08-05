import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ابدأ خطتك — نيوتري",
  description:
    "جاوب على أسئلة سريعة واحصل على خطة تغذية مخصصة لك: سعراتك اليومية، الماكروز، وهدف الماء — بنفس تجربة تطبيق نيوتري.",
  robots: { index: true, follow: true },
};

/**
 * The root layout already declares lang="ar", dir="rtl" and the Cairo font, so
 * this layout only carries the route's own metadata.
 *
 * The onboarding ships its own dark palette; it is scoped in globals.css to
 * `[data-nutree-onboarding]`, which leaves the Basmafit quiz pages on their
 * existing theme.
 */
export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
