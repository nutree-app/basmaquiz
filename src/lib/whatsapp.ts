import { PRODUCT_PAYMENT_LINKS, WHATSAPP_NUMBER } from "./config";
import { PRODUCTS } from "./products";
import { getComparisonPlan } from "./recommendation";
import { BasmaFitLead, QuizAnswers } from "./types";

function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function buildRecommendationReason(answers: QuizAnswers, programTitle: string): string {
  const reasonParts: string[] = [];
  if (answers.goal) reasonParts.push(`هدفك في ${answers.goal}`);
  if (answers.trainingPreference) reasonParts.push(`تفضيلك التمرين في ${answers.trainingPreference}`);
  if (answers.level) reasonParts.push(`مستواك ${answers.level}`);

  if (reasonParts.length === 0) {
    return `${programTitle} هو الخيار الأنسب لك بناء على إجاباتك في الاختبار.`;
  }

  return `بناء على ${reasonParts.join("، و")}، ${programTitle} هو الخيار الأنسب لمساعدتك على تحقيق هدفك بأفضل نتيجة.`;
}

// رسالة زر الواتساب في شاشة النتيجة النهائية فقط
// لا تحتوي الرسالة على اسم العميلة إطلاقًا، فقط بيانات الاختبار والمنتج الموصى به
export function getResultWhatsAppUrl(answers: QuizAnswers): string {
  const { upsell } = getComparisonPlan(answers);
  const product = PRODUCTS[upsell];
  const programTitle = product?.title ?? "";

  const lines: string[] = ["مرحبا 🌷", "اكملت اختبار بسمة فت، وهذه نتيجتي:", ""];

  if (programTitle) {
    lines.push(`🎯 البرنامج المناسب لي: ${programTitle}`, "");
  }

  const dataLines: string[] = [];
  if (answers.goal) dataLines.push(`• الهدف: ${answers.goal}`);
  if (answers.trainingPreference) dataLines.push(`• مكان التمرين: ${answers.trainingPreference}`);
  if (answers.level) dataLines.push(`• مستوى النشاط: ${answers.level}`);
  if (answers.weight) dataLines.push(`• الوزن الحالي: ${answers.weight} كجم`);
  // لا يوجد سؤال "الوزن المستهدف" في الاختبار الحالي، لذلك هذا السطر يُحذف دائمًا

  if (dataLines.length > 0) {
    lines.push("📌 بياناتي:", ...dataLines, "");
  }

  if (programTitle) {
    lines.push("💡 سبب الترشيح:", buildRecommendationReason(answers, programTitle), "");
  }

  const paymentLink = PRODUCT_PAYMENT_LINKS[upsell];
  if (paymentLink) {
    lines.push("لو حابة تكملي الطلب، تقدري تكمليه مباشرة من هنا 🤍", paymentLink, "");
  }

  lines.push("واذا عندك اي استفسار اخر تفضلي 🌷");

  return buildWhatsAppUrl(lines.join("\n"));
}

export function getInvoiceWhatsAppUrl(lead: BasmaFitLead): string {
  const message = `مرحبًا، أكملت الدفع لـ ${lead.selectedProductTitle} في بسمة فت.

هدفي: ${lead.goal}
مكان التمرين: ${lead.trainingPreference}
المستوى: ${lead.level}

هذه فاتورة الدفع، بانتظار تفعيل اشتراكي.`;
  return buildWhatsAppUrl(message);
}
