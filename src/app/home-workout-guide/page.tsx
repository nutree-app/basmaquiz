import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import {
  GuideCard,
  GuideCardGrid,
  GuideNote,
  GuideSection,
  GuideText,
} from "@/components/guide/GuideBlocks";
import {
  GuideWhatsAppButton,
  PdfLinkButton,
  StickyPdfBar,
} from "@/components/guide/GuideButtons";
import { GuideScreenshot } from "@/components/guide/GuideScreenshot";
import { GuideShell } from "@/components/guide/GuideShell";
import {
  GUIDE_DAY_EXAMPLES,
  GUIDE_QUICK_EXAMPLE_STEPS,
  GUIDE_SCREENSHOTS,
} from "@/lib/home-workout-guide";

const PAGE_TITLE = "طريقة استخدام جدول التمارين المنزلية";
const PAGE_DESCRIPTION =
  "دليل مبسط يوضح لك طريقة استخدام جدول التمارين المنزلية من بسمة فت: الفهرس، اختيار المستوى، التنقل بين الأيام، فتح مقاطع شرح التمارين، والإحماء والإطالة.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    type: "article",
    locale: "ar_SA",
    url: "/home-workout-guide",
  },
  // الملف خاص بالعميلات اللي اشترين الجدول، فما نضيف الصفحة لمحركات البحث
  robots: { index: false, follow: false },
};

export default function HomeWorkoutGuidePage() {
  return (
    <GuideShell>
      {/* المسافة السفلية تمنع الشريط الثابت من تغطية آخر المحتوى على الجوال */}
      <div className="animate-fade-in flex flex-1 flex-col px-5 pb-32 pt-10 sm:px-8 sm:pb-12">
        <header className="flex flex-col items-center text-center">
          <Logo />

          <h1 className="mt-8 text-2xl font-black leading-[1.5] text-foreground sm:text-3xl">
            {PAGE_TITLE}
          </h1>

          <p className="mt-4 text-base leading-8 text-muted">
            هذا الدليل يوضح لك طريقة استخدام جدول التمارين المنزلية والوصول
            السريع إلى تقسيمة التمارين، الأيام، مقاطع شرح التمارين، الإحماء
            والإطالة.
          </p>

          <div className="mt-7 w-full sm:max-w-sm">
            <PdfLinkButton context="home_workout_guide_top">
              فتح جدول التمارين
            </PdfLinkButton>
          </div>
        </header>

        <main className="mt-14">
          <GuideSection step="1" title="ابدئي من الفهرس">
            <GuideText>
              في بداية الملف راح تحصلين على الفهرس. اضغطي على اسم أي قسم، وراح
              ينقلك مباشرة إلى صفحته داخل الجدول بدون الحاجة للبحث بين الصفحات.
            </GuideText>

            <GuideNote>
              الضغط على «تقسيمة جدول التمارين» ينقلك مباشرة إلى الصفحة اللي فيها
              الجداول المتاحة.
            </GuideNote>

            <GuideScreenshot screenshot={GUIDE_SCREENSHOTS.index} />
          </GuideSection>

          <GuideSection step="2" title="اختاري الجدول المناسب لمستواك">
            <GuideCardGrid>
              <GuideCard title="المستوى المبتدئ" badge="ابدئي من هنا إذا كنت مبتدئة">
                إذا كنت مبتدئة، ابدئي من الأسبوع الأول والثاني، وهي أسابيع
                التسخين والتأسيس. تساعدك هذه المرحلة على تعلم الحركات وتجهيز
                جسمك قبل الانتقال إلى باقي الأسابيع.
              </GuideCard>

              <GuideCard title="المستوى المتوسط" badge="مناسب لمن لديها خبرة سابقة">
                إذا كان عندك خبرة سابقة في التمارين، تقدرين تبدئين من تقسيمة
                باقي الأسابيع واتباع الجدول المخصص للمستوى المتوسط.
              </GuideCard>
            </GuideCardGrid>

            <GuideScreenshot screenshot={GUIDE_SCREENSHOTS.levels} />
          </GuideSection>

          <GuideSection step="3" title="اضغطي على اليوم لفتح التمارين">
            <GuideText>
              داخل صفحة تقسيمة الجدول، اضغطي على اسم اليوم المطلوب مثل يوم الجسم
              العلوي، يوم الجسم السفلي، يوم الدفع، يوم السحب أو يوم الأرجل. راح
              ينتقل بك الملف مباشرة إلى جدول تمارين ذلك اليوم.
            </GuideText>

            <ul className="mt-5 flex flex-wrap gap-2">
              {GUIDE_DAY_EXAMPLES.map((day) => (
                <li
                  key={day}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-foreground"
                >
                  {day}
                </li>
              ))}
            </ul>

            <GuideScreenshot screenshot={GUIDE_SCREENSHOTS.week1Days} />
            <GuideScreenshot screenshot={GUIDE_SCREENSHOTS.remainingWeeksDays} />

            <GuideNote>
              أيام الراحة جزء أساسي من البرنامج، فلا تتجاوزينها.
            </GuideNote>
          </GuideSection>

          <GuideSection step="4" title="اضغطي على اسم التمرين أو صورته">
            <GuideText>
              بعد فتح جدول اليوم، راح تحصلين على اسم كل تمرين وعدد التكرارات
              والجولات. اضغطي على اسم التمرين، صورته أو الرابط الموجود بجانبه،
              وراح يفتح لك مقطع يوتيوب يشرح طريقة أداء التمرين.
            </GuideText>

            <GuideScreenshot screenshot={GUIDE_SCREENSHOTS.upperBodyTable} />
            <GuideScreenshot screenshot={GUIDE_SCREENSHOTS.pullDayTable} />

            <GuideNote>
              شاهدي شرح الحركة قبل البدء، وركزي على الأداء الصحيح قبل زيادة
              التكرارات أو الشدة.
            </GuideNote>
          </GuideSection>

          <GuideSection step="5" title="لا تنسين الإحماء والإطالة">
            <GuideCardGrid>
              <GuideCard title="إحماء قبل التمرين">
                اضغطي على زر أو رابط الإحماء قبل التمرين، وراح يفتح لك مقطع
                الإحماء مباشرة. طبقي الإحماء لمدة 5 دقائق قبل جميع أيام التمرين.
              </GuideCard>

              <GuideCard title="إطالة بعد التمرين">
                بعد الانتهاء من التمرين، اضغطي على زر أو رابط الإطالة، وراح يفتح
                لك مقطع الإطالة مباشرة.
              </GuideCard>
            </GuideCardGrid>

            <GuideNote>
              الإحماء يجهز جسمك للتمرين، والإطالة تساعدك على تهدئة العضلات بعده.
            </GuideNote>
          </GuideSection>

          <GuideSection title="مثال سريع">
            <ol className="flex flex-col gap-3">
              {GUIDE_QUICK_EXAMPLE_STEPS.map((step, index) => (
                <li
                  key={step}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink text-sm font-black text-white"
                  >
                    {index + 1}
                  </span>
                  <span className="text-sm font-bold leading-7 text-foreground sm:text-base">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </GuideSection>

          <section className="mt-14 rounded-3xl border border-border bg-card p-6 text-center sm:p-8">
            <h2 className="text-xl font-extrabold text-foreground">تحتاجين مساعدة؟</h2>

            <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
              إذا كان عندك أي استفسار عن الجدول، اختيار المستوى أو طريقة فتح
              مقاطع التمارين، تواصلي معنا على الواتساب وراح نساعدك.
            </p>

            <div className="mx-auto mt-6 sm:max-w-sm">
              <GuideWhatsAppButton>تواصلي معنا على الواتساب</GuideWhatsAppButton>
            </div>
          </section>

          <div className="mx-auto mt-10 sm:max-w-sm">
            <PdfLinkButton context="home_workout_guide_final">
              افتحي جدول التمارين وابدئي الآن
            </PdfLinkButton>
          </div>
        </main>

        <footer className="mt-14 border-t border-border pt-6 text-center">
          <p className="text-xs leading-6 text-muted">
            بسمة فت — دليل استخدام جدول التمارين المنزلية
          </p>
        </footer>
      </div>

      <StickyPdfBar />
    </GuideShell>
  );
}
