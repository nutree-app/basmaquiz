import { WHATSAPP_NUMBER } from "./config";
import { BasmaFitLead } from "./types";

function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// الرسالة الثابتة لزر الواتساب العائم في كل الشاشات
export function getFloatingWhatsAppUrl(): string {
  return buildWhatsAppUrl("مرحبًا، أكملت اختبار بسمة فت وأحتاج مساعدة في اختيار البرنامج المناسب.");
}

export function getInvoiceWhatsAppUrl(lead: BasmaFitLead): string {
  const message = `مرحبًا، أكملت الدفع لـ ${lead.selectedProductTitle} في بسمة فت.

هدفي: ${lead.goal}
مكان التمرين: ${lead.trainingPreference}
المستوى: ${lead.level}

هذه فاتورة الدفع، بانتظار تفعيل اشتراكي.`;
  return buildWhatsAppUrl(message);
}
